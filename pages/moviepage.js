import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { format } from "date-fns";
import { useRouter } from "next/router";
import TranslationComponent from "../components/translateComponent";
import TranslationComponentCountryName from "../components/translateComponentCountryName";

const MoviePage = () => {
  const router = useRouter();
  const movieId = router.query.movieId;
  const [movieIdRequest, setMovieIdRequest] = useState();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMovieIdRequest(movieId);
    Promise.all([
      fetch(
        `https://api.themoviedb.org/3/movie/${movieIdRequest}?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c&language=pt-BR`
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/${movieIdRequest}/watch/providers?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c`
      ),
    ])
      .then(([resMovie, resProviders]) =>
        Promise.all([resMovie.json(), resProviders.json()])
      )
      .then(([dataMovies, dataProviders]) => {
        setData({
          budget: dataMovies.budget,
          originalTitle: dataMovies.original_title,
          portugueseTitle: dataMovies.title,
          poster_path: dataMovies.poster_path,
          overview: dataMovies.overview,
          average: dataMovies.vote_average,
          releaseDate: dataMovies.release_date,
          image: dataMovies.poster_path,
          ratingCount: dataMovies.vote_count,
          popularity: dataMovies.popularity,
          gender: dataMovies.genres
            ? dataMovies.genres.map((genre) => genre.name).join(", ")
            : "",

          adult: dataMovies.adult,

          imdb: dataMovies.imdb_id,

          providersBR: dataProviders.results
            ? dataProviders.results.BR
              ? dataProviders.results.BR.flatrate
                ? dataProviders.results.BR.flatrate
                    .map((providerBR) => providerBR.provider_name)
                    .join(", ")
                : ""
              : ""
            : "",

          providersUS: dataProviders.results
            ? dataProviders.results.US
              ? dataProviders.results.US.flatrate
                ? dataProviders.results.US.flatrate
                    .map((providerUS) => providerUS.provider_name)
                    .join(", ")
                : ""
              : ""
            : "",

          country:
            dataMovies.production_countries &&
            dataMovies.production_countries[0]
              ? dataMovies.production_countries[0].name
              : "",

          originalLanguage: dataMovies.original_language,
        });
        setIsLoading(false);
      });
  }, [movieId, movieIdRequest]);

  if (isLoading) {
    return <p>Carregando dados...</p>;
  }

  let poster = "/callback.png";

  if (data.poster_path) {
    poster = "https://image.tmdb.org/t/p/original" + data.poster_path;
  }

  return (
    <>
      {" "}
      <span className={styles.title}>{data.originalTitle}</span>
      <br />
      <br />
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <span>
            <span>
              {poster != null ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={styles.card_image_big}
                  src={poster}
                  alt="poster"
                  width="480"
                  height="720"
                />
              ) : (
                <Image
                  className={styles.card_image_big}
                  src="/callback.png"
                  alt="poster"
                  width="480"
                  height="720"
                />
              )}
            </span>
          </span>
        )}
      </div>
      <div>
        <br />
        {/* Tabela aqui para baixo */}

        <table className={styles.tableMain}>
          <tr>
            <td className={styles.table}>T??tulo em Portugu??s:</td>
            <td className={styles.table}>{data.portugueseTitle}</td>
          </tr>

          {data.budget === 0 || data.budget === null ? null : (
            <tr>
              <td className={styles.table}>
                {data.budget === 0 || data.budget === null
                  ? null
                  : `Or??amento:`}
              </td>
              <td className={styles.table}>
                {" "}
                {data.budget === 0 || data.budget === null
                  ? null
                  : `${new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(data.budget)}`}
              </td>
            </tr>
          )}
          <tr></tr>

          <tr>
            <td className={styles.table}>Overview:</td>
            <td className={styles.table}>
              {" "}
              {data.overview ? data.overview : "Sem infos"}
            </td>
          </tr>

          <tr>
            <td className={styles.table}>N?? de votos:</td>
            <td className={styles.table}>{data.ratingCount}</td>
          </tr>
          <tr>
            <td className={styles.table}>Nota:</td>
            <td className={styles.table}>{data.average}</td>
          </tr>
          <tr>
            <td className={styles.table}>Imdb:</td>
            <td className={styles.table}>{data.imdb}</td>
          </tr>

          <tr>
            <td className={styles.table}>P??is de Origem:</td>
            <td className={styles.table}>
              <TranslationComponentCountryName
                text={data.country}
                language="pt"
              />
            </td>
          </tr>

          <tr>
            <td className={styles.table}>Idioma do Filme:</td>
            <td className={styles.table}>
              <TranslationComponent
                text={data.originalLanguage}
                language="pt"
              />
            </td>
          </tr>

          <tr>
            <td className={styles.table}>Data de Lan??amento:</td>
            <td className={styles.table}>
              {data.releaseDate
                ? format(new Date(data.releaseDate), " dd/MM/yyyy")
                : ""}
            </td>
          </tr>
          <tr>
            <td className={styles.table}>Popularidade:</td>
            <td className={styles.table}>{data.popularity}</td>
          </tr>
          <tr>
            <td className={styles.table}>Generos:</td>
            <td className={styles.table}>{data.gender}</td>
          </tr>
          <tr>
            <td className={styles.table}>
              {" "}
              {data.providersBR === null ? null : `Streamings Brasil:`}
            </td>
            <td className={styles.table}>
              {" "}
              {data.providersBR === null ? null : `${data.providersBR}`}
            </td>
          </tr>
          <tr>
            <td className={styles.table}>Streamings EUA:</td>
            <td className={styles.table}>{data.providersUS}</td>
          </tr>
        </table>
      </div>
    </>
  );
};

export default MoviePage;
