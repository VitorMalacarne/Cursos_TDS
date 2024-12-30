import { useState } from 'react';
import logo from '../assets/logo.png';

function SideBar(){
    const[nav, setNav] = useState([
        {label: "Home", slug: "/", icon: "icon-home"},
        {label: "Discover", slug: "discover", icon: "icon-list2"},
        {label: "Categories", slug: "categories", icon: "icon-price-tag"},
        {label: "My Courses", slug: "my-courses", icon: "icon-briefcase"}
    ]);
    const[currentPage, setCurrentPage] = useState("/");
    
    var navigation = [];
    for (let i = 0; i < nav.length; i++) {
        navigation.push(
            <li key={"nav-" + i + "-" + nav[i].slug}>
                <a href={nav[i].slug} className={'aic link noul flex c333' + (currentPage == nav[i].slug ? " on" : "")}>
                    <div className={'ico s20 ' + nav[i].icon}></div>
                    <h2 className='lbl s20'>{nav[i].label}</h2>
                </a>
            </li>
        );
    }

    return(
        <div className="sidebar fixed">
            <a href="#" className="logo bl">
                <img src={logo} className="bl"/>
            </a> 
            
            <ul className='nav'>
                {navigation}
            </ul>

            <div className="updated-course flex aic">
                <div className='icon-light-bulb cfff s24 ico'></div>
                <div className='lbl s15 fontb c333'>
                    Updated Courses
                    <h2 className='author s13 c777'>by Picudinho do 69</h2>
                </div>
            </div>

            <div className='stats aic jic flex'>
                <div className='stats-box flex'>
                    <div className='ico ico-points s24 icon-badge'></div>
                    <h2 className='var s15 c333 fontb'>1800</h2>
                    <h2 className='lbl s13 c777'>points</h2>
                </div>

                <div className='stats-box flex'>
                    <div className='ico ico-battery s24 icon-battery-half'></div>
                    <h2 className='var s15 c333 fontb'>45.3%</h2>
                    <h2 className='lbl s13 c777'>completed</h2>
                </div>
            </div>

            <div className="me flex aic">
                <div className='photo cfff s24'>
                    <img src='https://styles.redditmedia.com/t5_2wabp/styles/communityIcon_lnp25hfmcbg01.png'/>
                </div>
                <div className='lbl s15 fontb c333'>
                    Juca Bala
                    <h2 className='uname s13 c777'>@balinhajuca</h2>
                </div>
            </div>
        </div>
    );
}

export default SideBar;