import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";

// Custom accordion component with animation
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  
  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-xl font-medium text-gray-800 focus:outline-none hover:text-blue-600 transition-colors"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <svg 
          className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div 
        className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96" : "max-h-0"}`}
        ref={contentRef}
      >
        <p className="text-lg text-gray-700 py-2">{answer}</p>
      </div>
    </div>
  );
};

// Feature card component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-1 border-t-4 border-blue-500">
    <div className="text-blue-600 mb-4 text-3xl">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Statistics counter component
const StatCounter = ({ value, label, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    
    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const end = parseInt(value);
    const incrementTime = Math.floor(duration / end);
    let timer;
    
    const updateCounter = () => {
      start += 1;
      setCount(start);
      if (start < end) {
        timer = setTimeout(updateCounter, incrementTime);
      }
    };
    
    timer = setTimeout(updateCounter, incrementTime);
    
    return () => clearTimeout(timer);
  }, [value, duration, isVisible]);
  
  return (
    <div ref={counterRef} className="text-center">
      <div className="text-4xl font-bold text-blue-600">{count.toLocaleString()}+</div>
      <div className="text-gray-600 mt-2">{label}</div>
    </div>
  );
};

// Timeline component
const Timeline = ({ events }) => (
  <div className="relative">
    <div className="absolute left-8 top-0 bottom-0 w-1 bg-blue-200"></div>
    <div className="space-y-8">
      {events.map((event, index) => (
        <div key={index} className="relative pl-20">
          <div className="absolute left-4 top-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">{index + 1}</span>
          </div>
          <h3 className="text-xl font-medium text-gray-800">{event.title}</h3>
          <p className="text-gray-600 mt-1">{event.description}</p>
        </div>
      ))}
    </div>
  </div>
);

// Main component
const AboutPage = ({ user }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true); 
    }, 500);
    return () => clearTimeout(timer); 
  }, []);

  const faqData = [
    {
      question: "What is the purpose of this platform?",
      answer: "Our platform is designed to support high school students throughout the college admissions process, from searching for colleges to managing application deadlines and resources."
    },
    {
      question: "How do I add a college to my profile?",
      answer: "Use the interactive search tool to find your desired college, then click the 'Add to Profile' button to generate your personalized checklist."
    },
    {
      question: "Can I collaborate with others on my application?",
      answer: "Yes, our platform supports collaborative note editing and real-time feedback, so you can work with peers and mentors to strengthen your application."
    },
    {
      question: "Is my data secure on this platform?",
      answer: "Absolutely. We use industry-standard encryption and security practices to protect your personal information and application data. We never share your information with third parties without your explicit consent."
    },
    {
      question: "Do you offer scholarship information?",
      answer: "Yes, we provide comprehensive scholarship information, including eligibility requirements, application deadlines, and direct links to application portals for hundreds of scholarships across the country."
    },
    {
      question: "How do I get technical support?",
      answer: "You can reach our support team through the contact form on this page, or by emailing support@collegeprep.com. We typically respond within 24 hours on business days."
    }
  ];

  const testimonials = [
    {
      quote: "This platform transformed my college application experience! The personalized checklist kept me on track and helped me get into my dream school.",
      name: "Jane Doe",
      role: "Freshman, Stanford University"
    },
    {
      quote: "I loved the deadline management features. The reminders saved me from missing important dates and the collaborative tools helped me get great feedback on my essays.",
      name: "John Smith",
      role: "Freshman, MIT"
    },
    {
      quote: "As a first-generation college student, I was overwhelmed by the application process. This platform made everything clear and manageable.",
      name: "Maria Rodriguez",
      role: "Sophomore, UCLA"
    },
    {
      quote: "The scholarship database alone saved me thousands of dollars. I found three scholarships I wouldn't have discovered otherwise!",
      name: "Tyler Johnson",
      role: "Freshman, University of Michigan"
    }
  ];
  
  const features = [
    {
      icon: "🔍",
      title: "Interactive College Search",
      description: "Find the perfect colleges for you with our comprehensive search tool that includes Financial Statistics, Admission, Essays, Deadlines and much more!"
    },
    {
      icon: "✅",
      title: "Dynamic Checklists",
      description: "Stay organized with personalized application checklists that adapt to each college's unique requirements."
    },
    {
      icon: "⏰",
      title: "Deadline Management",
      description: "Never miss an important date with our smart calendar."
    },
    {
      icon: "⚖️",
      title: "Compare Colleges",
      description: "Compare various statistics like salaries, student faculty ratio, size, etc. for all of our colleges."
    },
    {
      icon: "📝",
      title: "Example Essays",
      description: "Find essays that have worked for real life students for some of the top colleges in the nation."
    },
    {
      icon: "🧑‍🎓",
      title: "Major Info",
      description: "Find the specific profile of a student for any given major of your choice at a specific school. Get inspired by our various essay topics and extracurricular activities tailored for that major and that school."
    },
  ];
  
  const timelineEvents = [
    {
      title: "Sign up",
      description: "Sign up and you already have access to all of our features! No setup needed."
    },
    {
      title: "Search and Compare Colleges",
      description: "Use our search tool to search and compare colleges for your application!"
    },
    {
      title: "Generate Checklists",
      description: "Add colleges to your profile to automatically generate personalized application checklists."
    },
    {
      title: "Find Ideas",
      description: "Whether if its with our list of essays that have worked for top colleges, or our curated list of extracurricular ideas and essay topics for specific majors AT specific colleges, you will find something to further your interestd"
    },
    {
      title: "Track Deadlines",
      description: "Stay on top of important dates with our calendar integration. Download your calendar data to implement them within Google Calendar or Apple Calendar"
    },
    {
      title: "Stay on Top",
      description: "Stay on top of your deadlines and requirements and submit your applications with confidence"
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 min-h-screen overflow-x-hidden">
      <Helmet>
        <title>College Ready - About Us</title>
        <meta
          name="description"
          content="Learn about College Ready: who we are, our mission, and how you can get in touch. Find FAQs, donate, or contact us to learn more."
        />
        <meta property="og:title" content="College Ready - About Us" />
        <meta
          property="og:description"
          content="Discover College Ready, our mission, FAQs, contact information, and how you can support our work through donations."
        />
        <meta property="og:url" content="https://www.collegeready.me/about" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="College Ready - About Us" />
        <meta
          name="twitter:description"
          content="Learn about College Ready, our mission, FAQs, and how you can contact or donate to support us."
        />
      </Helmet>
      <div className="pt-12 pb-24 px-4 md:px-12 max-w-6xl mx-auto">
        {/* Animated Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            About College Ready
          </h1>
          {user && (
            <p className="mb-4 text-xl text-gray-700">Welcome, {user.name}!</p>
          )}
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Empowering students on their journey to higher education with smart tools and resources.
          </p>
        </motion.div>
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto mb-8 bg-white rounded-lg shadow p-1">
          {["about", "features", "how", "faq", "contact", "donate"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 text-center font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab === "about" && "About Us"}
              {tab === "features" && "Features"}
              {tab === "how" && "How It Works"}
              {tab === "faq" && "FAQ"}
              {tab === "contact" && "Contact"}
              {tab === "donate" && "Donate"}
            </button>
          ))}
        </div>
        
        {/* Content Sections */}
        <div className="space-y-12">
          {/* About Section */}
          {activeTab === "about" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Mission Section */}
              <section className="bg-white p-8 rounded-xl shadow-lg mb-8">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0">
                    <h2 className="text-3xl font-semibold mb-4 text-gray-800">Our Mission</h2>
                    <p className="text-lg text-gray-700 mb-4">
                      We aim to democratize access to high-quality college preparation tools, making the college admissions process transparent, manageable, and stress-free for every student.
                    </p>
                    <p className="text-lg text-gray-700">
                      Founded by college admissions experts and education technology specialists, our platform bridges the gap between students and their dream colleges by providing the tools, resources, and guidance needed to navigate the complex admissions landscape.
                    </p>
                  </div>
                  <div className="md:w-1/2">
                    <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">Our Values</h3>
                      <ul className="space-y-2 text-lg text-gray-700">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">✓</span>
                          <span>Accessibility - Making college preparation available to all</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">✓</span>
                          <span>Transparency - Clear guidance through each step</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">✓</span>
                          <span>Empowerment - Giving students control of their journey</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">✓</span>
                          <span>Community - Supporting collaboration and shared success</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
              
              {/* Stats Section */}
              <section className="bg-white p-8 rounded-xl shadow-lg mb-8">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Our Collection</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <StatCounter value="165" label="Majors Supported" />
                  <StatCounter value="10000" label="Colleges Available" />
                  <StatCounter value="33" label="Deadlines/Statistics/Tips For Each College" />
                </div>
              </section>

              <section className="bg-white p-8 rounded-xl shadow-lg mb-8 text-center">
                <div className="flex flex-col items-center">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Who Am I?</h2>
                  <img
                    src="/assets/headshot.jpg"
                    alt="Joshua Kim"
                    className="w-24 h-24 rounded-full mb-4 border-2 border-gray-300"
                  />
                  <p className="text-lg text-gray-700">
                    I'm Joshua Kim, a University of Michigan student who built College Ready to simplify the college application process.
                  </p>
                  <a
                    href="https://kimjoshua.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center space-x-2 text-blue-600 hover:underline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 01-8 0 4 4 0 018 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14a9 9 0 00-9 9h18a9 9 0 00-9-9z"
                      />
                    </svg>
                    <span>kimjoshua.com</span>
                  </a>
                </div>
              </section>
              
            </motion.div>
          )}
          
          {/* Features Section */}
          {activeTab === "features" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <section className="bg-white p-8 rounded-xl shadow-lg mb-8">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                  ))}
                </div>
              </section>
            </motion.div>
          )}
          
          {/* How It Works Section */}
          {activeTab === "how" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <section className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">How Our Platform Works</h2>
                <p className="text-lg text-gray-700 text-center mb-8">
                  Our platform aggregates college data from multiple trusted sources and presents it through an intuitive interface. Follow these steps to maximize your college application success:
                </p>
                <Timeline events={timelineEvents} />
              </section>
            </motion.div>
          )}
          
          {/* FAQ Section */}
          {activeTab === "faq" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <section className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {[
                    {
                      question: "What is the purpose of this platform?",
                      answer: `When I was applying to college man it sucked, researching things all over the place allocating my deadlines, essays, requirements and all felt like such a hassle. I had to keep a cluttered google doc for all of it
                      and it was a complete mess. This originally started as a way for users to have a centralized college checklist, and from there I just kept adding features until it was an entire hub for everything college admissions.`
                    },
                    {
                      question: "How do I add a college to my profile?",
                      answer: "Use the search feature to search for colleges, through this you will be able to add colleges."
                    },
                    {
                      question: "Why isn't my college in the autocomplete/compare colleges?",
                      answer: "We cache/index colleges on demand, so that means we have a database of possible colleges yet their data hasn't been cached yet, just search whatever you want to search and we will instantly fetch the data"
                    },
                    {
                      question: "Why is the college search taking so long?",
                      answer: "Usually this means that the college hasn't been searched for yet and our AI web tools are currently gathering government and college information for you on demand"
                    },
                    {
                      question: "Where and how can I search up my major for a specific college?",
                      answer: "Once adding a college to your list, then you will be able to select that college and have the option below the checklist to enter in any major from what we support to learn the admitted student profile"
                    },
                    {
                      question: "Can I add/delete my own deadlines onto the calendar?",
                      answer: "Yes! We offer a notes feature which we will heavily enhance and add features where you have the optional choice to add a deadline or date to that note"
                    },
                    {
                      question: "What is an ics file regarding the deadlines?",
                      answer: "An ics file is 'a calendar file that uses a universal format for sharing event information' and can be downloaded onto your computer to be imported into calendars such as google calendar or apple calendar"
                    },
                    {
                      question: "Where can I ask for questions, concerns, suggestions, or other inquiries?",
                      answer: "Email us at support@collegeready.me"
                    },
                    {
                      question: "Do I have to pay to use this?",
                      answer: "Nope there are no payment plans or features, we run entirely on donations!"
                    },
                  ].map((item, index) => (
                    <FAQItem key={index} question={item.question} answer={item.answer} />
                  ))}
                </div>
              </section>
            </motion.div>
          )}
          
          {/* Contact Section */}
          {activeTab === "contact" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <section className="bg-white p-8 rounded-xl shadow-lg text-center">
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">Contact Us</h2>
                <p className="text-lg text-gray-700 mb-4">
                  For any inquiries, please reach out to us at:
                </p>
                <a
                  href="mailto:support@collegeprep.com"
                  className="text-xl text-blue-600 font-semibold hover:underline"
                >
                  support@collegeprep.com
                </a>
              </section>
            </motion.div>
          )}
          
          {/* Donate Section */}
          {activeTab === "donate" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
             <section className="bg-white p-8 rounded-xl shadow-lg text-center">
              <h2 className="text-3xl font-semibold mb-6 text-gray-800">Donate</h2>
              <p className="text-lg text-gray-700 mb-4">
                College Ready runs purely on donations; your support helps us continue to run!
              </p>
              <a
                href="https://www.buymeacoffee.com/joshuakim"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-colors"
              >
                Buy me a Coffee ☕
              </a>
            </section>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AboutPage;