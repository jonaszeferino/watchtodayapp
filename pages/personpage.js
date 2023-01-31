import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";
import Image from "next/image";

export default function Personapi() {
  const [personName, setPersonName] = useState("");
  const [personId, setPersonId] = useState(138);
  const [personArea, setPersonArea] = useState("");
  const [personImage, setPersonImage] = useState("");
  const [personReview, setPersonReview] = useState("");
  const [personImdb, setPersonImdb] = useState("");

  const [isError, setError] = useState(false);

  let personImageLet = `https://image.tmdb.org/t/p/original${personImage}`;

  const translations = {
    Acting: "Atuação",
    Directing: "Direção",
    Writing: "Escrita",
    Production: "Produção",
    Writing: "Roteiro",
    Camera: "Fotografia",
    Art: "Arte",
    Editing: "Edição",
    Sound: "Música",
    [`Costume & Make-Up`]: "Maquiagem e Figurino",
  };

  const apiCall = () => {
    const url = `https://api.themoviedb.org/3/person/${personId}?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c&language=pt-BR`;

    fetch(url, {})
      .then((response) => {
        if (response.status === 200) {
          setError(false);
          return response.json();
        } else {
          throw console.log("Erro 1");
        }
      })
      .then(
        (result) => (
          setPersonName(result.name),
          setPersonId(result.id),
          setPersonImdb(result.imdb_id),
          setPersonArea(result.known_for_department),
          setPersonImage(result.profile_path),
          setPersonReview(result.biography)
        )
      )
      .catch((error) => setError(true));
  };

  return (
    <div>
      <label>
        Procure Por Texto
        <input
          className={styles.card}
          required={true}
          type="text"
          value={personId}
          onChange={(event) => setPersonId(event.target.value)}
        />
      </label>

      <button onClick={apiCall}>Verificar</button>

      {isError === true ? (
        <ErrorPage message={``} />
      ) : (
        <div>
          <h3 className={styles.title}>{personName}</h3>
          <table className={styles.table}>
            <span>
              {personImage != null ? (
                <span>
                  {" "}
                  <Image
                    src={personImageLet}
                    alt="poster"
                    width="240"
                    height="360"
                  />{" "}
                </span>
              ) : (
                <span>
                  {" "}
                  <Image
                    src="/callback.png"
                    alt="poster"
                    width="240"
                    height="360"
                  />{" "}
                </span>
              )}
              <br />
            </span>

            <tbody>
              <tr className={styles.tr}>
                <td className={styles.td}>Nome</td>
                <td className={styles.td} />
                <td className={styles.td}>{personName}</td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.td}>IMDb ID</td>
                <td className={styles.td} />
                <td className={styles.td}>{personImdb}</td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.td}>Biografia</td>
                <td className={styles.td} />
                <td className={styles.td}>{personReview}</td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.td}>Area</td>
                <td className={styles.td} />
                <td className={styles.td}>
                  {translations[personArea] || personArea}
                </td>
              </tr>
            </tbody>
          </table>
          <br />
        </div>
      )}
    </div>
  );
}
