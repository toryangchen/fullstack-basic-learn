// import Header from './header.js'
// import Sidebar from './sidebar.js'
// import Content from './content.js'
//
// new Header()
// new Sidebar()
// new Content()

import createImage from './createImage.js';
import avatar from './avatar.jpg'
import style from './index.scss'

createImage()

var img = new Image();
img.src = avatar;
img.classList.add(style.avatar);
var root = document.getElementById('root')
root.append(img)