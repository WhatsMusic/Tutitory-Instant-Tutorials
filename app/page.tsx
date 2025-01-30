import TutorialForm from "../components/TutorialForm"

export default function Home() {

  return (
    <div className="container min-h-[70svh] w-full mx-2 sm:mx-auto p-4 sm:p-2">
      <h1 className="text-3xl font-bold mb-4 text-center">Tutitory – Your AI-Powered Tutorial Generator</h1>

      {/* SEO-Optimized Introduction Text */}
      <div className="mb-6">
        <p className="text-lg text-gray-700">
          Welcome to <strong>Tutitory</strong> – the intelligent platform for creating tutorials on any imaginable topic!
          Enter a keyword or topic, and our powerful AI generates a step-by-step guide in seconds, whether it’s about technology,
          art, music, or science. Perfect for beginners, intermediates, or experts looking for a quick start.
        </p>
      </div>

      <TutorialForm />


      {/* SEO Text Below */}
      <div className="mt-8 bg-gray-100 p-4 sm:p-2 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">What is Tutitory?</h2>
        <p className="text-gray-700 leading-relaxed">
          Tutitory is your new assistant for generating and sharing knowledge quickly and efficiently.
          Our platform leverages the latest advancements in Artificial Intelligence to provide you with tutorials
          and guides in clear, understandable language. Whether you’re looking for a tutorial on &quot;JavaScript Basics,&quot; &quot;Meditation Techniques,&quot; or &quot;DIY Projects&quot; &ndash; Tutitory has the answers.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">Why Use Tutitory?</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Create customized tutorials for your specific topic in seconds.</li>
          <li>Utilize our powerful AI to generate step-by-step guides.</li>
          <li>Access well-structured and easy-to-understand content – ideal for beginners and experts alike.</li>
          <li>Enhance learning materials with SEO-friendly structure and clear instructions.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">How Does It Work?</h2>
        <p className="text-gray-700 leading-relaxed">
          Simply enter a topic, such as &quot;Python Programming,&quot; &quot;Yoga for Beginners,&quot; or &quot;Webflow Basics.&quot;
          Or AI analyzes your topic and generates a detailed overview and content in seconds.
          Tutorials can be customized and expanded at any time.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">Search Engine Optimization (SEO)</h2>
        <p className="text-gray-700 leading-relaxed">
          All generated content is SEO-friendly, helping you effectively share your topics.
          With clear structures, keyword optimizations, and an XML sitemap, Tutitory supports you in making your content visible online.
        </p>
      </div>
    </div>
  );
}
