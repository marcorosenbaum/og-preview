import axios from "axios";
import { load } from "cheerio";

const getOgDataForNoSpa = async (url: string) => {
  try {
    const response = await axios.get(url);

    const $ = load(response.data);

    const ogData = {
      title: $("meta[property='og:title']").attr("content") || null,
      description: $("meta[property='og:description']").attr("content") || null,
      image: $("meta[property='og:image']").attr("content") || null,
    };

    return { url, ogData };
  } catch (error) {
    console.error("Error fetching OpenGraph data:" + error);
    return null;
  }
};

export default getOgDataForNoSpa;
