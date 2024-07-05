import React, { useEffect, useState, useRef } from 'react'
import './App.css';
// import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
// import { debounce } from 'lodash';

const devapiUrl = `https://devsidecms.ptw.com/art/?rest_route=/wl/v1/`;

const imageFormats = ['jpeg', 'png', 'svg', 'gif', 'webp', 'heif']

const videoFormats = ['mp4', 'mov', 'wmv', 'avi', 'webm', 'avchd']

const documentFormats = ['pdf']


const App = () => {
  const [modal, setModal] = useState(false)
  // const navigate = useNavigate()
  const [displayData, setDisplayData] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [previewModal, setPreviewModal] = useState(false)
  const [confidentialData, setConfidentialData] = useState([])
  // const [activeIndex, setActiveIndex] = useState(0)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  })
  const [err, setErr] = useState({
    nameErr: '',
    emailErr: '',
  })

  const toastRef = useRef(null)
  const swiperRef = useRef(null);

  // useEffect(() => {
  //   const handleContextMenu = (e) => {
  //     e.preventDefault();
  //   };

  //   document.addEventListener('contextmenu', handleContextMenu);

  //   return () => {
  //     document.removeEventListener('contextmenu', handleContextMenu);
  //   };
  // }, []);


  const getFileTypes = (type) => {
    let t = type.split('/')
    let tp = t[t.length - 1]
    // console.log(tp)
    return tp
  }
  

  useEffect(() => {
    document.title = 'PTW ART - Confidential Portfolio'
    let isSubmitted = Number(localStorage.getItem('is_signed_ptw_nda'))
    let isSubmittedCookie = Number(Cookies.get('is_signed_ptw_nda'))
    if (isSubmitted === 1 || isSubmittedCookie === 1) {
      setDisplayData(true)
      fetchDataFromAPI()
    } else {
      performingModalOps(true)
      setDisplayData(false)
    }
  }, [])

  // useEffect(() => {
  //   const handleKeyUp = (event) => {
  //     if (event.key === 'Enter') {
  //       callApiForSubbmittingData()
  //     }
  //   }
  //   window.addEventListener('keyup', handleKeyUp)
  //   return () => {
  //     window.removeEventListener('keyup', handleKeyUp)
  //   }
  // }, [])

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
            fetchDataFromAPI()
          } else {
            setDisabled(false)
            throwNotification()
          }
        })
        .catch((err) => {
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

  const fetchDataFromAPI = () => {
    axios.post(`${devapiUrl}portfolio`)
      .then(res => {
        setConfidentialData(res.data.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const showPreviewModal = (index) => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(index);

      setPreviewModal(!previewModal)
      // setTimeout(() => {
      //   if(previewModal === true) {
      //     document.body.style.overflow = 'hidden !important'
      //   } else {
      //     document.body.style.overflow = ''
      //   }
      // }, 500)
    }

  }

  return (
    <>
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
          <div className="image-gallery mb-5" style={{ marginTop: '5rem' }}>
            {confidentialData.length > 0 ? confidentialData.map((data, index) => (
              <React.Fragment key={index}>{imageFormats.includes(getFileTypes(data["mime-type"])) || videoFormats.includes(getFileTypes(data["mime-type"]))
                || documentFormats.includes(getFileTypes(data["mime-type"])) ? <>
                {
                  imageFormats.includes(getFileTypes(data["mime-type"])) ?
                    <div key={index} className="container-img">
                      <img
                        src={data.url}
                        alt={data.title}
                        className="gallery-image pad-15 image"
                      />
                      <div className="text-title">{data.title ? data.title : 'Image'}</div>
                      <div className="middle">
                        <div className="text" onClick={(e) => showPreviewModal(index)}>Click Here</div>
                      </div>
                    </div> : videoFormats.includes(getFileTypes(data["mime-type"])) ?
                      <div key={index} className="container-img">
                        <video
                          src={data.url}
                          alt={data.title}
                          className="gallery-image pad-15 image"
                        />
                        <div className="text-title">{data.title ? data.title : 'Video'}</div>
                        <div className="middle">
                          <div className="text" onClick={(e) => showPreviewModal(index)}>Click Here</div>
                        </div>
                      </div> : documentFormats.includes(getFileTypes(data["mime-type"])) ?
                        <div key={index} style={{ textAlign: 'center' }} className="container-img">
                          <iframe frameBorder="0" src={data.url + '#toolbar=0'} height={260} width={430} className="pad-15 image" />
                          <div className="text-title">{data.title ? data.title : 'Document'}</div>
                          <div className="middle">
                            <div className="text" onClick={(e) => showPreviewModal(index)}>Click Here</div>
                          </div>
                        </div> : ''
                }
              </> : null
              }</React.Fragment>

            )) : null}
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
      <div className={previewModal ? "preview-modal display-block" : "preview-modal display-none"} onClick={(e) => showPreviewModal()}>
        <section className="preview-modal-main" onClick={event => event.stopPropagation()}>
          {confidentialData.length > 0 ? 
          <Swiper
            spaceBetween={50}
            ref={swiperRef}
            navigation={true}
            modules={[Navigation]}
            className="mySwiper"
            slidesPerView={1}
            // initialSlide={activeIndex}
            // onSlideChange={(swiper) => console.log('slide change', swiper)}
            // onSwiper={(swiper) => console.log(swiper)}
          >
            {confidentialData.map((data, index) => (
              <React.Fragment key={index}>{imageFormats.includes(getFileTypes(data["mime-type"])) || videoFormats.includes(getFileTypes(data["mime-type"]))
                || documentFormats.includes(getFileTypes(data["mime-type"])) ?
                <SwiperSlide> {
                  imageFormats.includes(getFileTypes(data["mime-type"])) ?
                    <React.Fragment key={index}>
                      <img
                        src={data.url}
                        alt={data.title}
                        className="gallery-img"
                      />
                      <div className="caption">{data.title ? data.title : 'Image'}</div>
                    </React.Fragment> : videoFormats.includes(getFileTypes(data["mime-type"])) ? <React.Fragment key={index}>
                      <video
                        key={index}
                        src={data.url}
                        alt={data.title}
                        className="gallery-img"
                        controls
                      />
                      <div className="caption">{data.title ? data.title : 'Image'}</div>
                    </React.Fragment> : documentFormats.includes(getFileTypes(data["mime-type"])) ?
                      <div key={index}>
                        <iframe width="100%" height={800} frameBorder="0" src={data.url + '#toolbar=0'} />
                        <div className="caption">{data.title ? data.title : 'Image'}</div>
                      </div> : ''
                }
                </SwiperSlide> : ''
              }</React.Fragment>
            ))}
          </Swiper> : null}
          <button onClick={(e) => showPreviewModal()} className="close-btn">X</button>
        </section>
      </div>
      <ToastContainer />
    </>
  )
}

export default App

