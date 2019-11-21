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
    alert('Uploading..');
    return true;
  }

  function showResponse(responseText, statusText, xhr, $form) {
    alert(responseText);
    return true;   
  }
});
