function logIn({ id, username, name, profile_picture_url }) {
  localStorage.setItem(
    "user",
    JSON.stringify({ id, username, name, profile_picture_url }),
  );
}

function logOut() {
  localStorage.removeItem("user");
}

function getUser() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    throw new Error("User not found in storage.");
  }
  return user;
}

function isLogedIn() {
  try {
    return Boolean(getUser());
  } catch {
    return false;
  }
}

function getUserId() {
  return parseInt(getUser().id);
}

function getUsername() {
  return getUser().username;
}

function getName() {
  return getUser().name;
}

function getProfilePictureUrl() {
  return getUser().profile_picture_url;
}

export {
  logIn,
  logOut,
  getUser,
  isLogedIn,
  getUserId,
  getUsername,
  getName,
  getProfilePictureUrl,
};
