import axios from "axios";
import qs from "qs";
import "dotenv/config";

export const getGoogleOauthToken = async (code) => {
  const rootURl = "https://oauth2.googleapis.com/token";

  const options = {
    code,
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    grant_type: "authorization_code",
  };
  try {
    const { data } = await axios.post(rootURl, qs.stringify(options), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return data;
  } catch (err) {
    console.log(err.message);
    console.log("Failed to fetch Google Oauth Tokens");
    throw new Error(err);
  }
};

export const getGoogleUser = async (id_token, access_token) => {
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );

    return data;
  } catch (err) {
    console.log(err.message);
    console.log("Failed to fetch Data User Google Oauth Tokens");
    throw Error(err);
  }
};
