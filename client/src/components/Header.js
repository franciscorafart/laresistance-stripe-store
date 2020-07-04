import React from 'react';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const Head = styled.div`
    min-height: 50px;
    width: 100%;
    display: flex;
    flex-direction: row;
    background-color: #8f0000;
    position: fixed;
    top: 0;
`;

const OneQuarter = styled.div`
    width: 25%;
    heigth: 40px;

    @media all and (max-width: 750px) {
        width: 25%;
        margin: 10px 0 10px 0;
    }
`;

const LastQuarter = styled(OneQuarter)`
    @media all and (max-width: 750px) {
        display: none;
    }
`;

const Half = styled.div`
    width: 50%;

    @media all and (max-width: 750px) {
        width: 75%;
        margin: 10px 0 10px 0;
    }
`;

const Logo = styled.img`
    height: 30px;
    margin: 10px 0 0 20px;
`;

const A = styled.a`
    text-decoration: none;
    color: white;

    :hover {
        color: #e3d5c1;
        text-decoration: none;
    }

    @media all and (max-width: 750px) {
        text-align: center;
        padding: 10px;
        border-top: 1px solid rgba(255,255,255,0.3);
        border-bottom: 1px solid rgba(0,0,0,0.1);
    }
`;

const SocialMedia = styled(A)`
    display: block;
    width: 20px;

    @media all and (max-width: 750px) {
        width: 28px;
    }
`;

const Ul = styled.ul`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-top: 12px;
`;

const Li = styled.li`
    font-family: 'Encode Sans Expanded', sans-serif;
    font-size: 1em;
    color: white;
    list-style-type: none;
`;

const Header = (props) => {
        return props.menu.length>0?
                <Head>
                    <OneQuarter>
                        { <Logo src={props.logo.src} alt={props.logo.title}/>}
                    </OneQuarter>
                    <Half>
                        <Ul>
                        {
                            props.menu.filter(item => item.headerMenu).map(
                                item => {
                                return <Li
                                    key={item.slug}
                                >
                                    <A
                                        href={item.linkString}
                                    >{item.title}</A>
                                </Li>;
                            })
                        }
                        </Ul>
                    </Half>
                    <LastQuarter>
                        <Ul>
                        {
                            props.menu.filter(item => item.socialMedia).map( item => {
                                return <Li key={item.slug} className="text">
                                    <SocialMedia href={item.linkString}>
                                        <FontAwesomeIcon icon={fab[item.iconClass]} size="1x"/>
                                    </SocialMedia>
                                </Li>;
                            })
                        }
                        </Ul>
                    </LastQuarter>
                </Head>
            : null;
};

export default Header;