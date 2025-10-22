"use client";

import { FormEvent, useEffect, useState } from "react";
import { db } from "../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { clear } from "console";

interface Movie {
  id?: string;
  title?: string;
  releaseDate?: number | string;
  receivedAnOscar?: boolean;
  actors?: {
    actor: string[];
  };
}

function MovieList() {
  const [movieList, setMovieList] = useState<Movie[]>([]);

  const [newMovie, setNewMovie] = useState<Movie>({
    id: "",
    title: "",
    releaseDate: "releaseDate",
    receivedAnOscar: false,
    actors: {
      actor: [],
    },
  });

  const [editSelected, setEditSelected] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editMovie, setEditMovie] = useState<Movie>({});
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");

  const moviesCollectionRef = collection(db, "Movies");

  async function fetchMovies() {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filterededData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setMovieList(filterededData);

      console.log(filterededData);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  async function handleAddMovies(e: FormEvent) {
    e.preventDefault();

    clearForm();
    console.log(newMovie);
    await addDoc(moviesCollectionRef, newMovie);

    fetchMovies();
  }

  function clearForm() {
    setNewMovie({
      id: "",
      title: "",
      releaseDate: "releaseDate",
      receivedAnOscar: false,
      actors: {
        actor: [],
      },
    });
  }

  async function handleDeleteMovie(id: string) {
    try {
      const movieDoc = doc(moviesCollectionRef, id);
      await deleteDoc(movieDoc);
      fetchMovies();
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  }

  async function updateMovie(id: string) {
    if (!editField || !editValue) {
      alert("Please select a field and enter a value to edit");
      return;
    }

    try {
      const movieDoc = doc(moviesCollectionRef, id);

      // Create update object based on field
      let updateData: any = {};

      if (editField === "title") {
        updateData.title = editValue;
      } else if (editField === "releaseDate") {
        updateData.releaseDate = Number(editValue);
      } else if (editField === "receivedAnOscar") {
        updateData.receivedAnOscar = editValue.toLowerCase() === "true";
      } else if (editField === "actors") {
        updateData.actors = {
          actor: editValue.split(",").map((a) => a.trim()),
        };
      }

      await updateDoc(movieDoc, updateData);

      // Reset edit state
      setEditField("");
      setEditValue("");
      setIsEditing(false);

      // Refresh movies
      fetchMovies();

      console.log("Movie updated successfully");
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  }

  function handleMovieSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedMovie = movieList.find(
      (movie) => movie.id === e.target.value
    );
    setEditSelected(selectedMovie?.id || "");

    console.log("Selected movie ID:", editSelected);
  }

  return (
    <>
      <form className="border-2 border-red-400">
        <input
          className="border-2 border-gray-300 p-2"
          type="text"
          placeholder="movie title"
          value={newMovie.title}
          onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
        />
        <input
          className="border-2 border-gray-300 p-2"
          type="number"
          placeholder="release year"
          value={newMovie.releaseDate}
          onChange={(e) =>
            setNewMovie({ ...newMovie, releaseDate: Number(e.target.value) })
          }
        />
        <input
          className="border-2 border-gray-300 p-2"
          type="text"
          placeholder="actors"
          value={newMovie.actors?.actor.join(", ") || ""}
          onChange={(e) =>
            setNewMovie({
              ...newMovie,
              actors: {
                actor: e.target.value
                  .split(",")
                  .map((a) => a.trim())
                  .map((a) => a.trim()),
              },
            })
          }
        />
        <input
          className="border-2 border-gray-300 p-2"
          type="checkbox"
          checked={newMovie.receivedAnOscar}
          onChange={(e) =>
            setNewMovie({ ...newMovie, receivedAnOscar: e.target.checked })
          }
        />{" "}
        Received an Oscar
        <button
          className="border-amber-400 bg-pink-500 p-5 text-white"
          type="submit"
          onClick={handleAddMovies}
        >
          Add Movie
        </button>
      </form>
      <div>
        {movieList.map((movie) => (
          <div
            key={movie.id}
            className="mb-4 p-4 border border-red-600 rounded bg-slate-500 text-white"
          >
            <h1 className="text-xl font-bold"> Movie Name: {movie.title} </h1>
            <p> Release Year: {movie?.releaseDate} </p>
            <p> Actors: {movie?.actors?.actor?.join(", ")} </p>
            <p> Received Awards: {movie?.receivedAnOscar ? "Yes" : "No"}</p>
            <button
              className="border-2 bg-red-700 p-2 rounded text-white"
              onClick={() => handleDeleteMovie(movie.id!)}
            >
              Delete Movie
            </button>

            <select
              className="border-2 w-32 h-10 ml-10 text-black"
              value={editField}
              onChange={(e) => setEditField(e.target.value)}
            >
              <option value="">Select field to edit</option>
              <option value="title">Title</option>
              <option value="releaseDate">Release Date</option>
              <option value="receivedAnOscar">Oscar Award</option>
              <option value="actors">Actors</option>
            </select>

            <input
              type="text"
              className="border-2 border-gray-300 p-2 ml-2"
              placeholder="Enter new value"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
            <button
              onClick={() => updateMovie(movie.id!)}
              className="border-2 border-gray-300 p-2"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
export default MovieList;
