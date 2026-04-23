$(function () {

  $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
    preventSubmit: true,
    submitError: function ($form, event, errors) {
      // do nothing
    },
    submitSuccess: function ($form, event) {
      event.preventDefault();

      var name    = $("input#name").val();
      var email   = $("input#email").val();
      var phone   = $("input#phone").val();
      var message = $("textarea#message").val();
      var firstName = name.indexOf(' ') >= 0 ? name.split(' ')[0] : name;

      var $btn = $("#contactForm button[type='submit']");
      $btn.prop("disabled", true);

      fetch("https://formspree.io/f/mdayywrg", {   // <-- paste your ID here
        method: "POST",
        headers: { "Accept": "application/json" },
        body: JSON.stringify({ name: name, email: email, phone: phone, message: message })
      })
      .then(function (res) {
        if (res.ok) {
          $('#success').html(
            "<div class='alert alert-success'>" +
            "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>" +
            "<strong>Your message has been sent.</strong></div>"
          );
          $('#contactForm').trigger("reset");
        } else {
          throw new Error("Server error");
        }
      })
      .catch(function () {
        $('#success').html(
          "<div class='alert alert-danger'>" +
          "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>" +
          "<strong>Sorry " + firstName + ", something went wrong. Please try again later!</strong></div>"
        );
      })
      .finally(function () {
        setTimeout(function () { $btn.prop("disabled", false); }, 1000);
      });
    },
    filter: function () {
      return $(this).is(":visible");
    }
  });

  $("a[data-toggle='tab']").click(function (e) {
    e.preventDefault();
    $(this).tab("show");
  });
});

$('#name').focus(function () {
  $('#success').html('');
});