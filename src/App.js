import { useEffect, useState, useRef } from 'react'
import './App.css';
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const devapiUrl = `https://devsidecms.ptw.com/art/?rest_route=/wl/v1/`;

const dataDes = [
  {
    banner_image: '/img/cyberpunk2077.jpg',
    title: '',
  },
  {
    banner_image: '/img/cyberpunk2077.jpg',
    title: '',
  },
  {
    banner_image: '/img/sifu.jpg',
    title: '',
  },
  {
    banner_image: '/img/dl2.jpg',
    title: '',
  },
  {
    banner_image: '/img/godofwar_ragnarok.jpg',
    title: '',
  },
  {
    banner_image: '/img/plague.jpg',
    title: '',
  },
  {
    banner_image: '/img/sifu.jpg',
    title: '',
  },
  {
    banner_image: '/img/deadisland2.jpg',
    title: '',
  },
  {
    banner_image: '/img/godofwar_ragnarok.jpg',
    title: '',
  },
  {
    banner_image: '/img/plague.jpg',
    title: '',
  },
  {
    banner_image: '/img/plague.jpg',
    title: '',
  },
  {
    banner_image: '/img/sifu.jpg',
    title: '',
  },
  {
    banner_image: '/img/deadisland2.jpg',
    title: '',
  },
  {
    banner_image: '/img/godofwar_ragnarok.jpg',
    title: '',
  },
  {
    banner_image: '/img/plague.jpg',
    title: '',
  },
  {
    banner_image: '/img/cyberpunk2077.jpg',
    title: '',
  },
  {
    banner_image: '/img/cyberpunk2077.jpg',
    title: '',
  },
  {
    banner_image: '/img/sifu.jpg',
    title: '',
  },
  {
    banner_image: '/img/dl2.jpg',
    title: '',
  },
  {
    banner_image: '/img/godofwar_ragnarok.jpg',
    title: '',
  },
  {
    banner_image: '/img/plague.jpg',
    title: '',
  },
  {
    banner_image: '/img/sifu.jpg',
    title: '',
  },
  {
    banner_image: '/img/deadisland2.jpg',
    title: '',
  },
  {
    banner_image: '/img/godofwar_ragnarok.jpg',
    title: '',
  },
  {
    banner_image: '/img/plague.jpg',
    title: '',
  },
  {
    banner_image: '/img/plague.jpg',
    title: '',
  },
  {
    banner_image: '/img/sifu.jpg',
    title: '',
  },
  {
    banner_image: '/img/deadisland2.jpg',
    title: '',
  },
  {
    banner_image: '/img/godofwar_ragnarok.jpg',
    title: '',
  },
  {
    banner_image: '/img/plague.jpg',
    title: '',
  },
]

const App = () => {
  const [modal, setModal] = useState(false)
  const navigate = useNavigate()
  const [displayData, setDisplayData] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  })
  const [err, setErr] = useState({
    nameErr: '',
    emailErr: '',
  })

  const toastRef = useRef(null)

  useEffect(() => {
    document.title = 'PTW ART - Confidential Portfolio'
    let isSubmitted = Number(localStorage.getItem('is_signed_ptw_nda'))
    let isSubmittedCookie = Number(Cookies.get('is_signed_ptw_nda'))
    if (isSubmitted === 1 || isSubmittedCookie === 1) {
      setDisplayData(true)
    } else {
      performingModalOps(true)
      setDisplayData(false)
    }
  }, [])

  useEffect(() => {
    const handleKeyUp = (event) => {
      if (event.key === 'Enter') {
        callApiForSubbmittingData()
      }
    }
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const performingModalOps = (bool) => {
    setModal(bool)
  }
  const handleInputText = (e) => {
    const { value, id } = e.target
    setUserData((data) => ({ ...data, [id]: value }))
  }

  const throwNotification = () => {
    toast.warn('Some error occurred, please try again after sometime.', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    })
  }

  const callApiForSubbmittingData = (e) => {
    let validation = true
    let name = userData.name.trim()
    const regex = /^[a-zA-Z\s]*$/

    if (!regex.test(name)) {
      validation = false
      setErr((data) => ({ ...data, nameErr: 'Please enter a valid name!' }))
    } else if (name === '') {
      validation = false
      setErr((data) => ({ ...data, nameErr: 'Please enter a name!' }))
    } else if (name.length < 3) {
      validation = false
      setErr((data) => ({
        ...data,
        nameErr: 'Name must be at least 3 characters long',
      }))
    } else {
      setErr((data) => ({ ...data, nameErr: '' }))
    }

    if (userData.email.length <= 0) {
      validation = false
      setErr((data) => ({ ...data, emailErr: 'Please enter a email!' }))
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(userData.email)
    ) {
      validation = false
      setErr((data) => ({ ...data, emailErr: 'Please enter a valid email!' }))
    } else {
      setErr((data) => ({ ...data, emailErr: '' }))
    }

    if (validation) {
      setDisabled(true)
      toastRef.current = toast.info('Loading Confidential Portfolio.', {
        position: 'top-right',
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      })

      axios
        .post(`${devapiUrl}confidential`, {
          name: userData.name,
          email: userData.email,
        })
        .then((res) => {
          if (res.data.status_code === 200) {
            // console.log(res)
            localStorage.setItem('is_signed_ptw_nda', 1)
            Cookies.set('is_signed_ptw_nda', 1)
            toast.update(toastRef.current, {
              type: 'success',
              render: 'here you go.',
              position: 'top-right',
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'dark',
            })
            setDisabled(false)
            performingModalOps(false)
            setDisplayData(true)
          } else {
            setDisabled(false)
            throwNotification()
          }
        })
        .catch((err) => {
          // console.log(err)
          setDisabled(false)
          throwNotification()
        })
      setErr((data) => ({
        ...data,
        nameErr: '',
        emailErr: '',
      }))
    }
  }

  return (
    <>
      {/* <a href="#openModal-about">Modal</a> */}
      {displayData ? (
        <div className="container">
          <div className="Headsection">
            <div className="headTitle">
              <div className="contact-heading">
                <h1 className="headTag headTag1">Confidential</h1>
              </div>
              <div className="contact-heading">
                <h1 className="headTag headTag2 second">Portfolio</h1>
              </div>
            </div>
          </div>
          <div className="image-gallery" style={{ marginTop: '5rem' }}>
            {dataDes.map((data, index) => (
              <img
                key={index}
                src={data.banner_image}
                alt={data.banner_image}
                className="gallery-image"
              />
            ))}
          </div>
        </div>
      ) : null}
      {modal ? (
        <div
          id="openModal-about"
          style={
            modal
              ? { opacity: 1, pointerEvents: 'auto' }
              : { opacity: 0, pointerEvents: 'none' }
          }
          className="modalDialog"
        >
          <div>
            {/* <button
              className="close"
              onClick={(e) => {
                performingModalOps(false)
                setTimeout(() => {
                  navigate('/art/portfolio')
                }, 1000)
              }}
            >
              X
            </button> */}
            <h2>Agree to an NDA</h2>
            <div className="nda_content">
              <p className="p">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </p>
              <p className="p">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </p>
              <p className="p">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </p>
            </div>
            <div className="user_details">
              <div className="row">
                <div className="col-lg-6 text-left">
                  <label htmlFor="name">Name :</label>
                  <input
                    type="text"
                    id="name"
                    maxLength={25}
                    onChange={(e) => handleInputText(e)}
                  />
                  <div className="validation-message">{err.nameErr}</div>
                </div>
                <div className="col-lg-6 text-left">
                  <label htmlFor="email">Email :</label>
                  <input
                    type="email"
                    id="email"
                    maxLength={50}
                    onChange={(e) => handleInputText(e)}
                  />
                  <div className="validation-message">{err.emailErr}</div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <button
                className="portfolio-btn"
                onClick={(e) => callApiForSubbmittingData(e)}
                disabled={disabled}
              >
                Submit
              </button>
              &nbsp;&nbsp;&nbsp;
              {/* <button
                className="portfolio-btn"
                onClick={(e) => {
                  performingModalOps(false)
                  setTimeout(() => {
                    navigate('/art/portfolio')
                  }, 1000)
                }}
              >
                Cancel
              </button> */}
            </div>
          </div>
        </div>
      ) : null}
      {/* <Footer /> */}
      <ToastContainer />
    </>
  )
}

export default App

