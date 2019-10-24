// import Header from './fileloader/header'
// import Sidebar from './fileloader/sidebar'
// import Content from './fileloader/content'
//
// new Header()
// new Sidebar()
// new Content()
//
// import createImage from './cssloader/createImage.js';
// import avatar from './cssloader/avatar.jpg'
// import style from './index.scss'
//
// createImage()
//
// var img = new Image();
// img.src = avatar;
// img.classList.add(style.avatar);
// var root = document.getElementById('root')
// root.append(img)

// import './index.scss';
//
// var root = document.getElementById('root');
// root.innerHTML = ('<div class="iconfont iconchufangxiyouyan-">abc<div>');

// console.log('hello 111')
//
// import './hotload/style.css'
//
// var btn = document.createElement('button')
// btn.innerHTML = 'add'
// document.body.appendChild(btn);
// btn.onclick = function() {
// 	var div = document.createElement('div')
// 	div.innerHTML = 'item'
// 	document.body.appendChild(div);
// }
//

import counter from './hotload/counter';
import number from './hotload/number';
counter();
number();

if (module.hot) {
	module.hot.accept('./hotload/number', () => {
		document.body.removeChild(document.getElementById('number'));
		number();
	})
}