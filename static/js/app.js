window.onload = async () => {
  const params = new URLSearchParams(window.location.search);
  const websiteTokenUrlParam = params.get("token");
  const eventIdParam = params.get("event_id");
  const redirectUrlParam = params.get("redirect_back_url");
  const verifyTokenUrlParam = params.get("verify_token_url");
  const fallbackUrl = "https://www.eeml.eu";

  // If important values are not null, Save/Update localstorage
  saveToLocalStorage("token", websiteTokenUrlParam);
  saveToLocalStorage("verify_token_url", verifyTokenUrlParam);
  saveToLocalStorage("event_id", eventIdParam);
  saveToLocalStorage("redirect_back_url", redirectUrlParam);

  // Get token from storage
  const token = localStorage.getItem("token");
  const verifyTokenUrl = localStorage.getItem("verify_token_url");
  const eventId = localStorage.getItem("event_id");
  let redirectUrl = localStorage.getItem("redirect_back_url");

  if (!redirectUrl) {
    redirectUrl = fallbackUrl;
  }

  // No useful params
  if (!token || !verifyTokenUrl || !eventId) {
    error =
      "Please first login on " + redirectUrl + " before accessing Mini-Conf.";
    alertAndRedirect(error, redirectUrl);
  } else {
    const data = { event_id: eventId };
    fetch(verifyTokenUrl, {
      method: "post",
      headers: new Headers({
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    })
      .then((response) => {
        // Token verification successful
        if (response.ok) {
          window.history.replaceState({}, document.title, "/");
        } else {
          return response.json().then((text) => {
            throw new Error(
              text.message + " - Please login through " + redirectUrl + "."
            );
          });
        }
      })
      .catch((error) => {
        alertAndRedirect(error, redirectUrl);
      });
  }
};

function alertAndRedirect(error, redirectUrl) {
alert(error);
    setTimeout(() => {
        window.location.href = redirectUrl;
    },1000);
  // Redirect to login page

}

function saveToLocalStorage(key, value) {
  if (!!value) {
    localStorage.setItem(key, value);
  }
}