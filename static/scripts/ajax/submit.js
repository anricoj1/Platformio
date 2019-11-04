$(document).ready(function() {
  var options = {
    beforeSubmit: showRequest,
    success: showResponse
  };

  $('#frmUploader').submit(function() {
    $(this).ajaxSubmit(options);

    return false;
  });

  function showRequest(formData, jqForm, options) {
    alert('Upload is Starting');
    return true;
  }

  function showResponse(responseText, statusText, xhr, $form) {
    alert('status: ' + statusText + '\n\nresponseText: \n' + responseText);
    return true;   
  }
});
