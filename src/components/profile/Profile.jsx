import "./Profile.css";
import { useCallback, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import FlashMessages from "../parts/FlashMessage/FlashMessages";
import { Link, useNavigate, useParams } from "react-router";
import Posts from "../post/Posts";
import {
  getUserId,
  getUsername,
  isLogedIn,
  logOut,
} from "../../session/sessionManager";
import RelationsButtons from "./RelationsButtons";
import Avatar from "../parts/Avatar";
import { Mail, TriangleAlert } from "lucide-react";

function Profile() {
  const { data, errors, makeRequest } = useFetch();
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    makeRequest(`/profiles/${userId}`, "GET");
  }, [makeRequest, userId]);

  useEffect(() => {
    if (data?.delete) {
      setTimeout(() => {
        logOut();
        navigate("/");
      }, 3000);
    }
  }, [data, navigate]);

  const onRelationButtonClick = useCallback(
    function onRelationButtonClick() {
      makeRequest(`/profiles/${userId}`, "GET");
    },
    [makeRequest, userId],
  );

  function onMessageClick(profile) {
    navigate("/messages", {
      state: { currentChat: { id: profile.userId, name: profile.name } },
    });
  }

  function onDeleteAccountClick() {
    const securityAnswer = `delete ${getUsername()}`;
    if (
      prompt(
        `Are you sure you want to DELETE your account? write "${securityAnswer}" to confirm`,
      ).toLowerCase() === securityAnswer
    ) {
      makeRequest("/auth/account", "DELETE");
    }
  }

  return (
    <div className="profile">
      {typeof data?.profile !== "undefined" && (
        <div className="profile-header">
          <Avatar data={data.profile} size={8} />
          <div className="profile-description">
            <div className="name">
              <span>{data.profile.name}</span>
              {isLogedIn() && (
                <div className="buttons">
                  {data.profile.userId === getUserId() ? (
                    <>
                      <Link to="/profile/edit" className="button">
                        Edit profile
                      </Link>
                      <button
                        className="button delete-button delete-account-button"
                        onClick={onDeleteAccountClick}
                      >
                        <TriangleAlert /> Delete account
                      </button>
                    </>
                  ) : (
                    <>
                      {data.profile.isFriend && (
                        <button
                          className="button"
                          onClick={() => {
                            onMessageClick(data.profile);
                          }}
                          aria-label="Message"
                        >
                          <Mail />
                        </button>
                      )}
                      <RelationsButtons
                        onButtonClick={onRelationButtonClick}
                        profile={data.profile}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
            {data.profile.profession && (
              <div className="profession">{data.profile.profession}</div>
            )}
            {data.profile.bio && <div className="bio">{data.profile.bio}</div>}
            <Link
              className="button friends-count"
              to={`/friends/${data.profile.userId}`}
            >
              Friends: {data.profile.friendsCount}
            </Link>
          </div>
        </div>
      )}
      <FlashMessages data={data} errors={errors} />
      <Posts userId={userId} />
    </div>
  );
}

export default Profile;
