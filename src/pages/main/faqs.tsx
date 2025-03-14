import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

const FAQ = () => {
  const faqs = [
    {
      question: "What is a trading journal?",
      answer:
        "By using a trading journal, you can identify patterns in your trading behavior, learn from your mistakes, and make more informed trading decisions.",
    },
    {
      question: "Will there be updates to the trading journal?",
      answer:
        "By using a trading journal, you can identify patterns in your trading behavior, learn from your mistakes, and make more informed trading decisions.",
    },
    {
      question: "How can I benefit from using a trading journal?",
      answer:
        "By using a trading journal, you can identify patterns in your trading behavior, learn from your mistakes, and make more informed trading decisions.",
    },
    {
      question: "Is my trading data secure?",
      answer:
        "By using a trading journal, you can identify patterns in your trading behavior, learn from your mistakes, and make more informed trading decisions.",
    },
    {
      question: "Is the trading journal free?",
      answer:
        "By using a trading journal, you can identify patterns in your trading behavior, learn from your mistakes, and make more informed trading decisions.",
    },
    {
      question: "Can I customize my trading journal?",
      answer:
        "By using a trading journal, you can identify patterns in your trading behavior, learn from your mistakes, and make more informed trading decisions.",
    },
    {
      question: "What support options are available?",
      answer:
        "By using a trading journal, you can identify patterns in your trading behavior, learn from your mistakes, and make more informed trading decisions.",
    },
    {
      question: "Can I access my trading journal on mobile devices?",
      answer:
        "By using a trading journal, you can identify patterns in your trading behavior, learn from your mistakes, and make more informed trading decisions.",
    },
  ];

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Frequently asked questions
          </h2>
          <dl className="mt-16 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure
                key={faq.question}
                as="div"
                className="py-6 first:pt-0 last:pb-0"
              >
                {({ open }) => (
                  <>
                    <dt>
                      <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                        <span className="text-base/7 font-semibold">
                          {faq.question}
                        </span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusIcon aria-hidden="true" className="size-6" />
                          ) : (
                            <PlusIcon aria-hidden="true" className="size-6" />
                          )}
                        </span>
                      </DisclosureButton>
                    </dt>
                    <Transition
                      enter="transition duration-200 ease-out"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition duration-200 ease-in"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <DisclosurePanel as="dd" className="mt-2 pr-12">
                        <p className="text-base/7 text-gray-600">
                          {faq.answer}
                        </p>
                      </DisclosurePanel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
