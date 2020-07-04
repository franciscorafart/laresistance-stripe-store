import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

import "bootstrap/dist/css/bootstrap.min.css";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import Header from "./Header";
import SplitForm from './SplitForm';
import Product from './Product';
import Footer from './Footer';

import styled from 'styled-components';

const isProduction = process.env.NODE_ENV === 'production';
const stripeKey = isProduction? process.env.REACT_APP_LIVE_STRIPE_PUBLIC_KEY: process.env.REACT_APP_TEST_STRIPE_PUBLIC_KEY;

const stripePromise = loadStripe(stripeKey);

const AppContainer = styled.div`
    width: 100%;
`;

const Body = styled.div`
    margin-top: 50px;

    @media only screen and (max-width: 750px) {
        margin-top: 100px;
    }
`;

const ProductContainer = styled.div`
    padding: 40px 0 40px 0;
    width: 100%;
    min-height: 640px;
`;

const PositionedAlert = styled(Alert)`
    position: static;
    margin-top: 50px;
`;

const PermantentButton = styled(Button)`
    float: right;
    margin-right: 20px;
`;

const TokenP = styled.p`
    margin-top: 20px;
    font-size: 0.8em;
`;

const TokenSpan = styled.span`
    font-weight: 600px;
`;
// TODO (Future): Implement more products with cart and pull them from db

const loadProducts = setProducts => {
    fetch('/get_products', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
        'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    }).then(response => response.json()).then(data => {
        const cleanData = data.map(d => ({
            id: d.id,
            title: d.title,
            description: d.description,
            price: Number(d.price),
            slug: d.slug,
            imgUrl: d.image_url,
            currency: d.currency,
        }));

        setProducts(cleanData);
    });
}


const Container = () => {

    const [displayForm, setDisplayForm] = useState(false);
    const [price, setPrice] = useState(0);
    const [productId, setProductId] = useState(null);
    const [alert, setAlert] = useState({ display: false, message: '', variant: ''});
    const [showDownload, setShowDownload] = useState({ display: false, token: ''});
    const [permanentDownloadBtn, setPermanentDownloadBtn] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [products, setProducts] = useState([]);

    const menu = [
        {headerMenu: true, linkString: "/", order: 1, slug: "home", socialMedia: false, title: "Home"},
        {headerMenu: true, linkString: "/tutorials", order: 2, slug: "tutorials", socialMedia: false, title: "Tutorials"},
        {headerMenu: true, linkString: "/shop", order: 3, slug: "shop", socialMedia: false, title: "Shop"},
        {headerMenu: false, iconClass: "faInstagram", linkString: "https://www.instagram.com/", order: 2, slug: "instagram", socialMedia: true, title: "Instagram"},
        {headerMenu: false, iconClass: "faYoutube", linkString: "https://www.youtube.com/", order: 3, slug: "youtube", socialMedia: true, title: "Youtube"},
        {headerMenu: false, iconClass: "faFacebook", linkString: "https://www.facebook.com/", order: 4, slug: "facebook", socialMedia: true, title: "Facebook"},
        {headerMenu: false, iconClass: "faMedium", linkString: "https://medium.com/", order: 1, slug: "medium", socialMedia: true, title: "Medium"},
    ];

    useEffect(() => {
        loadProducts(setProducts);
      }, []);

    const logo = { src: '../assets/logo-placeholder.png', title: 'Logo' };

    const handleClose = () => {
        setDisplayForm(false);
    };

    const handleDownloadClose = () => {
        setShowDownload({display: false, token: ''});
    };

    const clearMessage = () => {
        setAlert({ display: false, variant: '', message: ''});
    };

    const displayAlert = (display, variant, message) => {
        setAlert({display: display, variant: variant, message:message });
    };

    const handleShowDownload = (token) => {
        setPermanentDownloadBtn(true);
        setShowDownload({ display: !showDownload.display, token: token })
    };

    const downloadGuide = () => {
        setDownloading(true);
        fetch('/download_guide', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
            'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({token: showDownload.token})
        })
        .then((response) => response.json())
        .then((data) => {
            const url = data.downloadUrl;
            let a = document.createElement('a');
            a.href = url;
            a.download = data.filename;
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            handleDownloadClose();
            setDownloading(false);
        });
    };

    return (
        <AppContainer>
            <Header
                menu={menu}
                logo={logo}
            />
            {alert.display && <PositionedAlert key={alert.variant} variant={alert.variant}>{alert.message}</PositionedAlert>}
            {permanentDownloadBtn &&
                <PermantentButton variant="outline-primary" size="sm" onClick={downloadGuide}>
                    {downloading? <span>Preparing file <Spinner animation="border" size="sm"/></span>
                        : "Download here"}
                </PermantentButton>}
            <Body>
                <ProductContainer>
                    {
                        products.map(p =>
                            <Product
                                key={p.slug}
                                slug={p.slug}
                                productId={p.id}
                                minimumPrice={p.price}
                                currency={p.currency}
                                imgUrl={p.imgUrl}
                                description={p.description}
                                title={p.title}
                                purchaseProduct={setDisplayForm}
                                setPrice={setPrice}
                                setProductId={setProductId}
                                clearMessage={clearMessage}
                            />
                        )
                    }
                </ProductContainer>
                <Modal
                    show={displayForm}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Enter your card information
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Elements stripe={stripePromise}>
                            <SplitForm
                                price={price}
                                displayAlert={displayAlert}
                                handleShowDownload={handleShowDownload}
                                handleClose={handleClose}
                                productId={productId}
                            />
                        </Elements>
                    </Modal.Body>
                    <Modal.Footer>
                        <span>Powered by Stripe</span>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    show={showDownload.display}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Download your guide
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Button onClick={downloadGuide}>
                            {downloading? <span>Preparing file <Spinner animation="border" size="sm"/></span>
                                : "Download here"}
                        </Button>
                        <TokenP>{`Save this token`}</TokenP><TokenSpan>{showDownload.token}</TokenSpan>
                        <TokenP>{"You can use it to get the DIY Podcast Studio again if you ever need to"}</TokenP>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleDownloadClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Footer
                    menu={menu}
                    logo={logo}
                />
            </Body>
        </AppContainer>
    );
};

export default Container;
