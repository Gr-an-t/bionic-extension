function convertToBionic() {
  function modifyTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      var words = node.nodeValue.split(/(\s+)/); // Split by spaces while keeping them

      var modifiedWords = words.map(function (item) {
        if (/\S/.test(item)) { // Check if the item is not just whitespace
          var halfLength = Math.ceil(item.length / 2) - 1; // Use Math.ceil to handle odd lengths
          var firstHalf = item.substring(0, halfLength);
          var secondHalf = item.substring(halfLength);
          return "<b>" + firstHalf + "</b>" + secondHalf;
        }
        return item; // Return whitespace items unchanged
      });

      var span = document.createElement('span');
      span.innerHTML = modifiedWords.join('');
      node.parentNode.replaceChild(span, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (var i = 0; i < node.childNodes.length; i++) {
        modifyTextNodes(node.childNodes[i]);
      }
    }
  }

  var elements = document.querySelectorAll('p, span');
  elements.forEach(function (element) {
    modifyTextNodes(element);
  });
}

chrome.webNavigation.onCompleted.addListener((details) => {
  if (!details.url.includes('chrome://')) {
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      function: convertToBionic
    });
  }
});
