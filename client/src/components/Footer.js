import React from 'react';
import styled from 'styled-components';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FooterContainer = styled.div`
    background-color: #231f20;
    min-height: 200px;
    width: 100%;
    display: flex;
    flex-direction:row;
    justify-content: space-around;

    @media all and (max-width: 750px){
        flex-direction: column;
    }
`;

const OneThird = styled.div`
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-content: flex-end;
    flex: 1;

    @media all and (max-width: 750px){
        padding: 20px 40px 20px 40px;
    }
`;

const Ul = styled.ul`
    margin: 0px;
    padding: 0px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const SocialMedia = styled.a`
    display: block;
    margin-top: 20px;
    text-decoration: none;
    color: #e3d5c1;
`;

const Li = styled.li`
    font-family: 'Encode Sans Expanded', sans-serif;
    font-size: 1em;
    color: #e3d5c1;
    list-style-type: none;
`;

const H3 = styled.h3`
    font-family: 'Encode Sans Expanded', sans-serif;
    font-size: 1em;
    color: #e3d5c1;
`;

const H4 = styled.h4`
    font-family: 'Encode Sans Expanded', sans-serif;
    font-size: 0.8em;
    color: #e3d5c1;
`;

const MiddleThird = styled(OneThird)`
    @media all and (max-width: 750px){
        display: none;
    }
`;


const Footer  = props => {
        return(
            <FooterContainer>
                <OneThird>
                    <H3>Contact:</H3>
                    <H4>laresistance [at] laresistance.media</H4>
                </OneThird>
                <MiddleThird/>
                <OneThird>
                    <H3>Follow us on Social Media:</H3>
                    <Ul>
                    {
                        props.menu?
                        props.menu.filter(
                            item => item.socialMedia
                        ).sort((a,b) => a.order<b.order?1:-1).map(
                                item => {
                                return <Li key={item.slug} className="text">
                                        <SocialMedia href={item.linkString}>
                                            <FontAwesomeIcon icon={fab[item.iconClass]} size="2x"/>
                                        </SocialMedia>
                                    </Li>;
                                })
                            :<div></div>
                    }
                    </Ul>
                </OneThird>
            </FooterContainer>
        );
};

export default Footer;
