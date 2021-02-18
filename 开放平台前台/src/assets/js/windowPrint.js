/* eslint-disable */
let handleWindowPrint = (ele, fileName, vm) => {

  var oIframe = document.createElement('iframe');
  var oScript = document.createElement('script');

  document.body.appendChild(oIframe);

  var titleText = document.head.getElementsByTagName('title')[0].innerText;
  document.head.getElementsByTagName('title')[0].innerText = `${fileName}`;

  oIframe.contentDocument.head.innerHTML =
    `<meta charset="utf-8">
      <title>${fileName}</title>
      <meta name="format-detection" content="telephone=no">
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">`;

  // oIframe.contentWindow.document.body.innerHTML = document.querySelector(ele).outerHTML;
  oIframe.contentDocument.body.innerHTML = document.querySelector(ele).outerHTML;
  oScript.innerHTML = 'window.print();';
  oIframe.contentDocument.body.appendChild(oScript);
  document.body.removeChild(oIframe);
  document.head.getElementsByTagName('title')[0].innerText = titleText;

};

export default handleWindowPrint;
