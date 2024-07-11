import React, { useEffect, useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'

const devapiUrl = `https://devsidecms.ptw.com/art/?rest_route=/wl/v1/`

const documentFormats = ['pdf']

const Portfolio = () => {
    const [pdfData, setPdfData] = useState([])
    const [displayData, setDisplayData] = useState(false)
    const [confidentialData, setConfidentialData] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        document.title = `Ptw Art - Portfolio PDF List`
        let isSubmitted = Number(localStorage.getItem('is_signed_ptw_nda'))
        let isSubmittedCookie = Number(Cookies.get('is_signed_ptw_nda'))
        if (isSubmitted === 1 || isSubmittedCookie === 1) {
            getPdfListFromServer()
        } else {
            navigate('/portfolio')
        }

    }, [])

    const getPdfListFromServer = () => {
        axios.post(`${devapiUrl}portfolio`)
            .then(res => {
                setConfidentialData(res.data.data)
                setDisplayData(true)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const getFileTypes = (type) => {
        let t = type.split('/')
        let tp = t[t.length - 1]
        // console.log(tp)
        return tp
    }

    return (
        <>
            {displayData ? (
                <div className="container">
                    <div className="Headsection">
                        <div className="headTitle">
                            <div className="contact-heading">
                                <h1 className="headTag headTag1">Portfolio</h1>
                            </div>
                            <div className="contact-heading">
                                <h1 className="headTag headTag2 second">PDF List</h1>
                            </div>
                        </div>
                    </div>
                    <div className="image-gallery mb-5" style={{ marginTop: '5rem' }}>
                        {confidentialData.length > 0 ? confidentialData.map((data, index) => (
                            <React.Fragment key={index}>{documentFormats.includes(getFileTypes(data["mime-type"])) ? <>
                                {documentFormats.includes(getFileTypes(data["mime-type"])) ?
                                    <><div key={index} style={{ textAlign: 'center' }} className="container-img">
                                        <iframe frameBorder="0" src={data.url + '#toolbar=0'} height={260} width={430} className="pad-15 image" />
                                        <div className="text-title">{data.title ? data.title : 'Document'}</div>
                                        <div className="middle">
                                            <a rel="noreferrer" href={data.url} target='_blank' className="text">Click Here</a>
                                        </div>
                                    </div>
                                    </> : ''
                                }
                            </> : null
                            }</React.Fragment>

                        )) : null}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <button onClick={(e) => navigate('/portfolio')} className='next-button'>Back To Portfolio</button>
                    </div>
                </div>
            ) : null}
        </>
    )
}

export default Portfolio