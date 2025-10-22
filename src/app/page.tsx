import Auth from "@/components/Auth";
import MovieList from "@/components/MovieList";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl">Welcome to Firebase!</h1>
      <p>This is a simple starter template.</p>
      <Auth />
      <MovieList />
    </div>
  );
}
