import type { GetStaticProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { MutatingDots } from "react-loader-spinner";
import { FetchBlocks, type ListBlockChildrenResponseEx } from "rotion";
import { Page } from "rotion/ui";
import Hed from "../components/hed";
import { MakeOgImage } from "../src/lib/ogimage";

type Props = {
	contact: ListBlockChildrenResponseEx;
	ogimage?: string;
};

const title = "Contact";
const desc = "Say Hello";

const turnstileSitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY as string;
type RenderParameters = {
	sitekey: string;
	callback?(token: string): void;
	"error-callback"?(): void;
};
declare global {
	interface Window {
		onloadTurnstileCallback(): void;
		turnstile: {
			render(container: string | HTMLElement, params: RenderParameters): string;
			reset(widgetId: string): void;
		};
	}
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const contact = await FetchBlocks({
		block_id: process.env.NOTION_CONTACT_PAGE_ID as string,
	});
	const ogimage = await MakeOgImage(`${title}`, `contact`);
	return {
		props: {
			contact,
			ogimage,
		},
	};
};

const formError = (msg: string) => {
	return <p className="error">{msg}</p>;
};

const captchaError = (msg: string) => {
	return <p className="captcha-error">{msg}</p>;
};

const Contact: NextPage<Props> = ({ contact, ogimage }) => {
	const endpoint = `https://contact.tomohisaoda.com/`;
	const initQuery = {
		name: "",
		email: "",
		message: "",
		token: "",
	};
	const [formStatus, setFormStatus] = useState(false);
	const [lockStatus, setLockStatus] = useState(false);
	const [query, setQuery] = useState(initQuery);
	const [errors, setErrors] = useState(initQuery);
	const [turnstileError, setTurnstileError] = useState("");

	const handleChange =
		() => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const name = e.target.name;
			const value = e.target.value;
			setQuery((prevState) => ({
				...prevState,
				[name]: value,
			}));
		};

	const validateEmail = (v: string) => {
		const re =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(v);
	};

	const validate = () => {
		let isValid = true;

		Object.entries(query).forEach(([k, v]) => {
			if (k === "token") {
				if (v.length === 0) {
					isValid = false;
				}
				setTurnstileError(v.length === 0 ? "* Please check for CAPTCHA." : "");
			} else if (v.length === 0) {
				isValid = false;
				setErrors((prevState) => ({
					...prevState,
					[k]: `* This field is required.`,
				}));
			} else if (v.length < 3) {
				isValid = false;
				setErrors((prevState) => ({
					...prevState,
					[k]: `* This input is too short.`,
				}));
			} else if (k === "email" && !validateEmail(v)) {
				isValid = false;
				setErrors((prevState) => ({
					...prevState,
					[k]: `* This email address format is incorrect.`,
				}));
			}
		});

		return isValid;
	};

	const handleSubmit = (
		e: React.FormEvent<HTMLFormElement | HTMLTextAreaElement>,
	) => {
		e.preventDefault();
		setLockStatus(true);
		setErrors(initQuery);

		if (!validate()) {
			setLockStatus(false);
			return;
		}

		const formData = new FormData();
		Object.entries(query).forEach(([key, value]) => {
			formData.append(key, value);
		});

		fetch(endpoint, { method: "POST", body: formData })
			.then((_res) => {
				setLockStatus(false);
				setFormStatus(true);
				setQuery(initQuery);
			})
			.catch((_err) => {
				setLockStatus(false);
			});
	};

	const [widgetId, setWidgetId] = useState("");
	const scriptId = "cf-turnstile-script";
	const isScriptInjected = () => !!document.querySelector(`#${scriptId}`);
	const removeScript = () => {
		const el = document.getElementById(scriptId);
		if (el) {
			el.remove();
		}
	};
	const onSuccess = (token: string) => {
		setQuery((prevState) => ({
			...prevState,
			token: token,
		}));
		setTurnstileError("");
	};
	const onError = () => {
		setTurnstileError("* Network error.");
	};

	useEffect(() => {
		window.onloadTurnstileCallback = () => {
			const id = window.turnstile.render("#turnstile-widget", {
				sitekey: turnstileSitekey,
				callback: onSuccess,
				"error-callback": onError,
			});
			setWidgetId(id);
		};
		const { turnstile } = window;
		if (turnstile && widgetId !== "") {
			turnstile.reset(widgetId);
		} else {
			if (isScriptInjected()) {
				removeScript();
			}
			const script = document.createElement("script");
			script.id = scriptId;
			script.src =
				"https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback";
			document.getElementsByTagName("head")[0].appendChild(script);
		}
	}, [widgetId, isScriptInjected, onError, onSuccess, removeScript]);

	return (
		<div className="page-list">
			<Hed title={title} desc={desc} ogimage={ogimage} path="/contact" />
			<header className="grider page-list-header">
				<span></span>
				<div>
					<h1>{title}</h1>
					<Page blocks={contact} />
				</div>
			</header>

			<section className="page-list-body">
				<form onSubmit={handleSubmit}>
					<legend className="form-name grider">
						<label htmlFor="name" className="form-label">
							Full Name
						</label>
						<div className="form-body">
							<input
								type="text"
								id="name"
								placeholder="Alan Mathison Turing"
								name="name"
								value={query.name}
								onChange={handleChange()}
							/>
							{errors.name && formError(errors.name)}
						</div>
					</legend>

					<legend className="form-email grider">
						<label htmlFor="email" className="form-label">
							Email Address
						</label>
						<div className="form-body">
							<input
								type="email"
								id="email"
								placeholder="alan@example.com"
								name="email"
								value={query.email}
								onChange={handleChange()}
							/>
							{errors.email && formError(errors.email)}
						</div>
					</legend>

					<legend className="form-message grider">
						<label htmlFor="message" className="form-label">
							Message
						</label>

						<div className="form-body">
							<textarea
								name="message"
								id="message"
								rows={5}
								value={query.message}
								onChange={handleChange()}
							/>
							{errors.message && formError(errors.message)}
						</div>
					</legend>

					<div className="form-button grider">
						<span></span>
						<div className="form-body">
							<div id="turnstile-widget" className="checkbox" />
							{turnstileError !== "" && captchaError(turnstileError)}
							{formStatus ? (
								<p>Thanks for your message!</p>
							) : lockStatus ? (
								<MutatingDots
									color="#999"
									secondaryColor="#fff"
									height={100}
									width={100}
								/>
							) : (
								<button
									className="neumorphism-h"
									type="submit"
									disabled={lockStatus}
								>
									Submit 🚀
								</button>
							)}
						</div>
					</div>
				</form>
			</section>
		</div>
	);
};

export default Contact;
