const openPreview = (preview: string) => {
  const newWindow = window.open("http://localhost:3000/preview", "_blank");
  if (newWindow !== null) {
    newWindow.document.open();
    newWindow.document.write(preview);
    newWindow.document.close();
    newWindow.focus();
  }
};

export default openPreview;
