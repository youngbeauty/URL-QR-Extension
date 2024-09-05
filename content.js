// 创建按钮
function createButton() {
  const button = document.createElement('div');
  button.id = 'qr-code-button';
  
  // 通过消息获取图标 URL
  chrome.runtime.sendMessage({action: "getIconUrl"}, function(response) {
    button.innerHTML = '<img src="' + response.iconUrl + '" alt="QR Code">';
  });
  
  document.body.appendChild(button);
  return button;
}

// 创建QR码容器
function createQRContainer() {
  const container = document.createElement('div');
  container.id = 'qr-code-container';
  document.body.appendChild(container);
  return container;
}

// 生成QR码
function generateQRCode(url) {
  return new Promise((resolve) => {
    const qr = new QRCode(document.createElement("div"), {
      text: url,
      width: 256,
      height: 256,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
    
    // QRCode.js 生成的是 <img> 元素，我们需要获取其 src
    const imgSrc = qr._el.firstChild.toDataURL("image/png");
    resolve(imgSrc);
  });
}

// 获取网站logo
async function getWebsiteLogo() {
    // 1. 查找 <link rel="icon"> 或 <link rel="shortcut icon"> 或 <link rel="apple-touch-icon">
    let favicon = document.querySelector('link[rel="icon"]') || 
                  document.querySelector('link[rel="shortcut icon"]') || 
                  document.querySelector('link[rel="apple-touch-icon"]');
    
    // 2. 如果找到 favicon，则返回其 URL
    if (favicon) {
      return favicon.href;
    }
  
    // 3. 尝试从默认路径获取favicon.ico
    const defaultFavicon = `${window.location.origin}/favicon.ico`;
  
    try {
      const response = await fetch(defaultFavicon, { method: 'HEAD' });
      if (response.ok) {
        return defaultFavicon;
      }
    } catch (error) {
      console.error("Error fetching default favicon:", error);
    }
  
    // 4. 如果上述方法都失败，返回占位符图片
    return 'https://via.placeholder.com/64';
  }
  

// 主函数
async function main() {
  const button = createButton();
  const container = createQRContainer();
  let isQRVisible = false;

  button.addEventListener('click', async () => {
    if (isQRVisible) {
      container.style.display = 'none';
      isQRVisible = false;
    } else {
      const url = window.location.href;
      const qrCodeUrl = await generateQRCode(url);
      const logoUrl = await getWebsiteLogo();
      const siteName = document.domain;
      const pageTitle = document.title.substring(0, 15);

      container.innerHTML = `
        <div class="qr-code-wrapper">
          <img src="${qrCodeUrl}" alt="QR Code" width="256" height="256">
        </div>
        <div class="site-info">
          <img src="${logoUrl}" alt="Logo" class="logo">
          <div class="text-info">
            <div>${siteName}</div>
            <div><strong>${pageTitle}</strong></div>
          </div>
        </div>
      `;
      container.style.display = 'block';
      isQRVisible = true;
    }
  });
}

main();