import axios from "axios";
import cheerio from "cheerio";

// remember to test with NO SPA project
const getOgDataForNoSpa = async (url: string) => {
  console.log("* using axios and cheerio * for url:", url);
  try {
    const response = await axios.get(url);

    const $ = cheerio.load(response.data);

    const ogData = {
      title: $("meta[property='og:title']").attr("content") || null,
      description: $("meta[property='og:description']").attr("content") || null,
      image: $("meta[property='og:image']").attr("content") || null,
    };

    return { url, ogData };
  } catch (error) {
    console.error("Error fetching OpenGraph data:", error);
    return null;
  }
};

export default getOgDataForNoSpa;
