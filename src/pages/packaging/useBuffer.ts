import axios from "axios";
import * as React from "react";
import { OFF_SEARCH } from "../../const";

type Parameters = {
  page: number;
  country?: string;
  creator?: string;
  code?: string;
};

type Packaging = {
  material: string;
  number: string;
  recycling: string;
  shape: string;
};

type ProductDescription = {
  code: number;
  states: any;
  lang: string;
  image_packaging_url: string;
  packagings: Packaging[];
  product_name: string;
  images: any;
  creator: string;
};
function getProductsToAnnotateUrl({
  page = 1,
  country = "en:france",
  creator,
  code = "",
}: Parameters) {
  if (code) {
    return `https://fr.openfoodfacts.org/api/v3/product/${code}.json?fields=code,lang,image_packaging_url,product_name,packagings,images,creator,countries`;
  }
  let creatorTagNumber = 2;
  if (country) {
    creatorTagNumber += 1;
  }

  return `${OFF_SEARCH}?json=true&${
    page ? `page=${page}&` : ""
  }fields=code,states,lang,image_packaging_url,packagings,product_name,images,creator,countries&action=process&sort_by=unique_scans_n&tagtype_0=states&tag_contains_0=contains&tag_0=packaging-to-be-completed&tagtype_1=states&tag_contains_1=contains&tag_1=packaging-photo-selected${
    country
      ? `&tagtype_2=countries&tag_contains_2=contains&tag_2=${country}`
      : ""
  }${
    creator
      ? `&tagtype_${creatorTagNumber}=creator&tag_contains_${creatorTagNumber}=contains&tag_${creatorTagNumber}=${creator}`
      : ""
  }`;
}

export const useBuffer = ({
  country,
  creator,
  code,
}: Omit<Parameters, "page">): [ProductDescription[], () => void] => {
  const [page, setPage] = React.useState(() => Math.ceil(Math.random() * 100));
  const [data, setData] = React.useState<ProductDescription[]>(null);
  const [maxPage, setMaxPage] = React.useState<number>(100);

  const url = getProductsToAnnotateUrl({ page, country, creator, code });

  const canReset = React.useRef(false);
  React.useEffect(() => {
    if (canReset.current) {
      setData([]);
      setPage(1);
    }
  }, [country, creator]);

  React.useEffect(() => {
    if (data != null && data.length === 0) {
      setPage((p) => Math.min(maxPage, p + 1));
    }
  }, [data, maxPage]);

  React.useEffect(() => {
    let isValid = true;
    axios.get(url).then(({ data }) => {
      if (isValid) {
        setData(data.products ?? [data.product]);
        setMaxPage(Math.floor(data.count / data.page_size) + 1);
        canReset.current = true;
      }
    });
    return () => {
      isValid = false;
    };
  }, [url]);

  const next = () =>
    setData((prev) => (prev && prev.length > 0 ? prev.slice(1) : prev));
  console.log(data);
  return [data, next];
};
