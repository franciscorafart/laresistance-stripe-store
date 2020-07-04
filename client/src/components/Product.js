import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Image, Form }from 'react-bootstrap';

const ProductDiv = styled.div`
    display: flex;
    flex-wrap: center;
    flex-direction: row;
    min-height: 400px;
    margin: 0 20px 40px 20px;

    @media only screen and (max-width: 750px) {
        flex-direction: column;
    }
`;

const Box = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    width: 33%;

    @media only screen and (max-width: 750px) {
        justify-content: center;
        align-items: center;
        width: 100%;
    }
`;

const StyledForm = styled(Form)`
    width: 100%;
`;

const ProductImage = styled(Image)`
    width: 100%;

    @media only screen and (max-width: 750px) {
        width: 60%;
    }
`;

const PurchaseButton = styled(Button)`
    width: 160px;
    height: 40px;
`;

const Parragraph = styled.p`
    font-family: 'Encode Sans Expanded', sans-serif;
    font-size: 1.1em;
`;

const Description = styled(Parragraph)`
    line-height: 200%;
`;

const H1 = styled.h1`
    font-family: 'Encode Sans Expanded', sans-serif;
    font-size: 1.6em;
    margin-bottom: 20px;
`;
const H2 = styled.h1`
    font-family: 'Encode Sans Expanded', sans-serif;
    font-size: 1.4em;
`;

const GraySpan = styled.span`
    font-family: 'Encode Sans Expanded', sans-serif;
    font-size: 0.8m;
    color: gray;
`;

const FormGroup = styled(Form.Group)`
    margin-bottom: 40px;
`;

const Product = props => {
    const [price, setPrice] = useState(props.minimumPrice); // Initialize with minimum price

    const onAmountChange = e => {
        const editableValue = e.target.value;
        setPrice(editableValue);
    };

    const onRangeChange = e => {
        const rangeValue = e.target.value;
        setPrice(rangeValue);
    };

    const onAmountBlur = e => {
        const intendedValue = Number(e.target.value);

        if (intendedValue < props.minimumPrice) {
            setPrice(parseFloat(props.minimumPrice).toFixed(2));
        } else {
            setPrice(parseFloat(intendedValue).toFixed(2));
        }
    };

    return (
        <ProductDiv>
            <Box>
                <H1>{props.title || ""}</H1>
                <Description>
                    {props.description || ""}
                </Description>
            </Box>
            <Box>
                <ProductImage src={props.imgUrl} alt={props.slug} rounded/>
            </Box>
            <Box>
                <StyledForm>
                    <FormGroup controlId="formMinimumPrice">
                        <Form.Label><H2>{`$${props.minimumPrice}`}</H2><GraySpan>{`Minimum price`}</GraySpan></Form.Label>
                        <Form.Label></Form.Label>
                    </FormGroup>

                    <FormGroup controlId="formBasicRange">
                        <Form.Label><Parragraph>{'Drag the slider to contribute more'}</Parragraph></Form.Label>
                        <Form.Control
                            type="range"
                            min={Number(props.minimumPrice)}
                            max={Number(props.minimumPrice)*2}
                            value={price}
                            step={0.1}
                            onChange={onRangeChange}
                            onBlur={onAmountBlur}
                            onFocus={props.clearMessage}
                        />
                    </FormGroup>

                    <FormGroup controlId="formBasicPassword" >
                        <Form.Label><Parragraph>You pay </Parragraph></Form.Label>
                        <GraySpan>{" (US $)"}</GraySpan>
                        <Form.Control
                            type="number"
                            value={price}
                            onChange={onAmountChange}
                            onBlur={onAmountBlur}
                            onFocus={props.clearMessage}
                        />
                    </FormGroup>
                    <PurchaseButton
                        onClick={() => {
                            props.setPrice(Number(price));
                            props.setProductId(props.productId);
                            props.purchaseProduct(true);
                            props.clearMessage();
                        }}
                    ><Parragraph>Checkout</Parragraph></PurchaseButton>
                </StyledForm>
            </Box>
        </ProductDiv>
    );
};

export default Product;