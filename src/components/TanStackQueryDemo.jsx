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

const Timer = ({ time }) => {
  return (
    <div className="mt-4 flex items-center justify-end">
      <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        Time taken:{" "}
        <span className="font-bold tabular-nums">
          {time ? `${time}ms` : "Calculating..."}
        </span>
      </div>
    </div>
  );
};

const UseEffectExample = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const startTime = performance.now();

    const fetchData = async () => {
      try {
        const result = await fetchPosts();
        if (isMounted) {
          setData(result);
          setLoading(false);
          setTime(Math.round(performance.now() - startTime));
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

  if (loading)
    return (
      <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 h-full flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading (useEffect)...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 bg-red-50 rounded-2xl border border-red-100 h-full flex items-center justify-center text-red-600">
        Error: {error.message}
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col">
      <div className="mb-4 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          Old Way: useEffect
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Manually handling loading, error, and state.
        </p>
      </div>

      <ul className="flex-1 space-y-2 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {data.map((post) => (
          <li
            key={post.id}
            className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 text-sm border border-transparent hover:border-gray-200"
          >
            {post.title}
          </li>
        ))}
      </ul>
      <Timer time={time} />
    </div>
  );
};

const TanStackQueryExample = () => {
  const [startTime] = useState(performance.now());
  const [time, setTime] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  useEffect(() => {
    if (!isLoading && data) {
      setTime(Math.round(performance.now() - startTime));
    }
  }, [isLoading, data, startTime]);

  if (isLoading)
    return (
      <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 h-full flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">
            Loading (TanStack Query)...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 bg-red-50 rounded-2xl border border-red-100 h-full flex items-center justify-center text-red-600">
        Error: {error.message}
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-32 h-32 text-indigo-500"
        >
          <path
            fillRule="evenodd"
            d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div className="mb-4 pb-4 border-b border-gray-100 relative z-10">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          New Way: TanStack Query
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Automatic caching, background refetching, and more.
        </p>
      </div>

      <ul className="flex-1 space-y-2 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar relative z-10">
        {data.map((post) => (
          <li
            key={post.id}
            className="p-3 bg-indigo-50/50 rounded-xl hover:bg-indigo-50 transition-colors text-gray-800 text-sm border border-transparent hover:border-indigo-100"
          >
            {post.title}
          </li>
        ))}
      </ul>
      <Timer time={time} />
    </div>
  );
};

const CodeBlock = ({ code, language = "javascript" }) => (
  <div className="rounded-xl overflow-hidden shadow-md border border-gray-800 bg-[#1e1e1e]">
    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div className="text-xs text-gray-400 font-mono">{language}</div>
    </div>
    <div className="p-4 overflow-x-auto">
      <pre className="text-sm font-mono text-gray-300 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  </div>
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight mb-4">
            TanStack Query <span className="text-indigo-600">vs</span> useEffect
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500">
            Compare the code complexity, performance, and developer experience.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Old Way Column */}
          <div className="space-y-6">
            <UseEffectExample />
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
                  />
                </svg>
                Implementation Details
              </h4>
              <CodeBlock code={useEffectCode} />
            </div>
          </div>

          {/* New Way Column */}
          <div className="space-y-6">
            <TanStackQueryExample />
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-indigo-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
                  />
                </svg>
                Implementation Details
              </h4>
              <CodeBlock code={tanStackQueryCode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TanStackQueryDemo;
