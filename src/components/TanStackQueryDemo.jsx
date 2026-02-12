import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const fetchPosts = async () => {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=20",
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

const UseEffectExample = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const result = await fetchPosts();
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <div>Loading (useEffect)...</div>;
  if (error) return <div>Error (useEffect): {error.message}</div>;

  return (
    <div className="border border-[#ccc] p-3.75 rounded-lg bg-[#f9f9f9] h-full">
      <h3 className="mt-0 text-[#333]">Old Way: useEffect</h3>
      <ul className="pl-5">
        {data.map((post) => (
          <li key={post.id} className="mb-1.25 text-[#555]">
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

const TanStackQueryExample = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) return <div>Loading (TanStack Query)...</div>;
  if (error) return <div>Error (TanStack Query): {error.message}</div>;

  return (
    <div className="border border-[#ccc] p-3.75 rounded-lg bg-[#f9f9f9] h-full">
      <h3 className="mt-0 text-[#333]">New Way: TanStack Query</h3>
      <ul className="pl-5">
        {data.map((post) => (
          <li key={post.id} className="mb-1.25 text-[#555]">
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

const CodeBlock = ({ code }) => (
  <pre className="bg-[#282c34] text-[#f8f8f2] p-3.75 rounded-[5px] overflow-x-auto text-[14px] leading-normal">
    <code>{code}</code>
  </pre>
);

const useEffectCode = `const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  let isMounted = true;
  fetchPosts()
    .then(result => {
      if (isMounted) {
        setData(result);
        setLoading(false);
      }
    })
    .catch(err => {
      if (isMounted) {
        setError(err);
        setLoading(false);
      }
    });
  return () => { isMounted = false };
}, []);`;

const tanStackQueryCode = `const { data, isLoading, error } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
});`;

const TanStackQueryDemo = () => {
  return (
    <div className="p-5 font-sans max-w-300 mx-auto">
      <h2>TanStack Query vs useEffect</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        <div className="flex flex-col gap-5">
          <UseEffectExample />

          <div className="bg-white border border-[#eee] p-2.5 rounded-lg">
            <h4 className="mt-0 text-[#333]">Syntax</h4>
            <CodeBlock code={useEffectCode} />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <TanStackQueryExample />

          <div className="bg-white border border-[#eee] p-2.5 rounded-lg">
            <h4 className="mt-0 text-[#333]">Syntax</h4>
            <CodeBlock code={tanStackQueryCode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TanStackQueryDemo;
