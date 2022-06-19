import { useState } from 'react'
import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { FetchBlocks, ListBlockChildrenResponseEx } from 'notionate'
import { Blocks } from 'notionate/dist/components'
import { MutatingDots } from 'react-loader-spinner'

type Props = {
  contact: ListBlockChildrenResponseEx
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const contact = await FetchBlocks(process.env.NOTION_CONTACT_PAGE_ID as string)
  return {
    props: {
      contact,
    },
    revalidate: 10
  }
}

const formError = (msg: string) => {
  return (
    <>
      <p className="error">{msg}</p>
      <style jsx>{`
        .error {
          color: #FF0000;
          position: absolute;
          font-size: var(--fontSize-0);
          font-family: var(--fontFamily-sans);
        }
      `}</style>
    </>
  )
}

const Contact: NextPage<Props> = ({ contact }) => {
  const endpoint = `https://linyows.lolipop.jp/contact.tomohisaoda.com/`
  const initQuery = {
    name: ``,
    email: ``,
    message: ``,
  }
  const [formStatus, setFormStatus] = useState(false)
  const [lockStatus, setLockStatus] = useState(false)
  const [query, setQuery] = useState(initQuery)
  const [errors, setErrors] = useState(initQuery)

  const handleChange = () => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name
    const value = e.target.value
    setQuery((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const validateEmail = (v: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(v)
  }

  const validate = () => {
    let isValid = true

    Object.entries(query).forEach(([k, v]) => {
      if (v.length === 0) {
        isValid = false
        setErrors((prevState) => ({
          ...prevState,
          [k]: `* This field is required.`
        }))
      } else if (v.length < 3) {
        isValid = false
        setErrors((prevState) => ({
          ...prevState,
          [k]: `* This input is too short.`
        }))
      } else if (k === 'email' && !validateEmail(v)) {
        isValid = false
        setErrors((prevState) => ({
          ...prevState,
          [k]: `* This email address format is incorrect.`
        }))
      }
    })

    return isValid
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement | HTMLTextAreaElement>) => {
    e.preventDefault()
    setLockStatus(true)
    setErrors(initQuery)

    if (!validate()) {
      setLockStatus(false)
      return
    }

    const formData = new FormData()
    Object.entries(query).forEach(([key, value]) => {
      formData.append(key, value)
    })

    fetch(endpoint, { method: 'POST', body: formData })
      .then(res => {
        setLockStatus(false)
        setFormStatus(true)
        setQuery(initQuery)
        console.log(res)
      })
      .catch(err => {
        setLockStatus(false)
        console.log(err)
      })
  }

  return (
    <>
      <header className="grider category-header">
        <span></span>
        <div>
          <h1>Contact</h1>
          {Blocks({ blocks: contact })}
        </div>
      </header>

      <section>
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
            {formStatus ? (<p>Thanks for your message!</p>) : lockStatus ? (<MutatingDots color="#999" secondaryColor="#fff" height={100} width={100} />) : (<button className="neumorphism-h" type="submit" disabled={lockStatus}>Submit</button>)}
            </div>
          </div>
        </form>
      </section>

      <style jsx>{`
        input, textarea {
          font-family: var(--fontFamily-sans);
          font-size: var(--fontSize-3);
          border: none;
        }
        button {
          padding: var(--spacing-4) var(--spacing-8);
          cursor: pointer;
        }
        .form-label {
          text-align: right;
          font-family: var(--fontFamily-sans);
          margin-top: var(--spacing-10);
        }
        .form-body {
          margin-top: var(--spacing-8);
        }
        .form-name input {
          min-width: 60%;
        }
        .form-email input {
          min-width: 60%;
        }
        .form-message textarea {
          width: 100%;
          height: 15rem;
        }
        .form-button {
          margin-top: var(--spacing-5);
          font-family: var(--fontFamily-sans);
        }
      `}</style>
    </>
  )
}

export default Contact