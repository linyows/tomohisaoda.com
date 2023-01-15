import { useState } from 'react'
import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { FetchBlocks, ListBlockChildrenResponseEx } from 'notionate'
import { Blocks } from 'notionate/dist/components'
import { MutatingDots } from 'react-loader-spinner'
import Hed from '../components/hed'
import { MakeOgImage } from '../src/lib/ogimage'

type Props = {
  contact: ListBlockChildrenResponseEx
  ogimage?: string
}

const title = `Contact`
const desc = ``

export const getStaticProps: GetStaticProps<Props> = async () => {
  const contact = await FetchBlocks(process.env.NOTION_CONTACT_PAGE_ID as string)
  const ogimage = await MakeOgImage(`${title}`, `contact`)
  return {
    props: {
      contact,
    },
    revalidate: 10
  }
}

const formError = (msg: string) => {
  return <p className="error">{msg}</p>
}

const Contact: NextPage<Props> = ({ contact, ogimage }) => {
  const endpoint = `https://contact.tomohisaoda.com/`
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
      })
      .catch(err => {
        setLockStatus(false)
      })
  }

  return (
    <div className="page-root">
      <Hed title={title} desc={desc} ogimage={ogimage} />
      <header className="grider page-root-header">
        <span></span>
        <div>
          <h1>{title}</h1>
          {Blocks({ blocks: contact })}
        </div>
      </header>

      <section className="page-root-body">
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
            {formStatus ? (<p>Thanks for your message!</p>) : lockStatus ? (<MutatingDots color="#999" secondaryColor="#fff" height={100} width={100} />) : (<button className="neumorphism-h" type="submit" disabled={lockStatus}>Submit 🚀</button>)}
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}

export default Contact
