import React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Volume2,
  Palette,
  UtensilsCrossed,
  Church,
  Landmark,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const venues = [
  {
    title: "Open Hall",
    subtitle: "Open-Air Celebrations",
    description:
      "A spacious setting for weddings, family functions and celebrations with an open, comfortable atmosphere.",
    icon: Landmark,
    image: "/images/Close_hall.png",
    large: true,
  },
  {
    title: "Closed / Banquet Hall",
    subtitle: "Elegant Indoor Gatherings",
    description:
      "A comfortable indoor space for ceremonies, receptions and private family occasions.",
    icon: Landmark,
    image: "/images/Night_open_hall.png",
  },
  {
    title: "Temple / Mandir",
    subtitle: "Traditional Ceremonies",
    description:
      "A peaceful traditional space for rituals, blessings and meaningful family ceremonies.",
    icon: Church,
    image: "/images/Murti_image.png",
  },
];

const eventSupport = [
  {
    icon: Volume2,
    title: "Sound & Audio",
    text: "Sound arrangements for ceremonies, announcements, music and celebrations can be discussed with the Triveni Bhavan team.",
  },
  {
    icon: Palette,
    title: "Decoration",
    text: "Decoration arrangements can be discussed with the Triveni Bhavan team to create the atmosphere and setup you want for your occasion.",
  },
  {
    icon: UtensilsCrossed,
    title: "Catering",
    text: "Food and catering arrangements can be discussed based on your event, menu preferences and guest requirements.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

function VenueSpaces() {
  const scrollTo = (id) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section
      id="venue"
      className="relative overflow-hidden bg-[#F7F3ED] py-20 sm:py-24 lg:py-32"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-20 h-72 w-72 rounded-full bg-[#C6A15B]/10 blur-3xl" />
        <div className="absolute -left-32 bottom-20 h-80 w-80 rounded-full bg-[#42151F]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* =========================================================
            HEADER
        ========================================================== */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mb-14 max-w-3xl text-center sm:mb-16 lg:mb-20"
        >
          <motion.div
            variants={fadeUp}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/30 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8E6F35] shadow-sm backdrop-blur-md"
          >
            <Sparkles size={13} />
            Our Venue
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-serif text-4xl leading-[1.08] tracking-tight text-[#211B19] sm:text-5xl lg:text-6xl"
          >
            Spaces made for
            <span className="block text-[#8E6F35]">beautiful celebrations.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#211B19]/60 sm:text-base"
          >
            From open-air gatherings to intimate indoor ceremonies and
            traditional rituals, Triveni Bhavan gives every occasion its own
            space and character.
          </motion.p>
        </motion.div>

        {/* =========================================================
            VENUE CARDS
        ========================================================== */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="grid gap-5 lg:grid-cols-12"
        >
          {/* Featured Open Hall */}
          <motion.article
            variants={fadeUp}
            className="group relative min-h-[460px] overflow-hidden rounded-[2rem] border border-white/70 bg-[#211B19] shadow-[0_25px_70px_rgba(33,27,25,0.14)] sm:min-h-[560px] lg:col-span-7"
          >
            <img
              src={venues[0].image}
              alt={venues[0].title}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#211B19] via-[#211B19]/35 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[#E4C77E] backdrop-blur-md">
                  <Landmark size={19} />
                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  Featured Space
                </span>
              </div>

              <h3 className="font-serif text-3xl text-white sm:text-4xl">
                {venues[0].title}
              </h3>

              <p className="mt-2 text-sm font-medium text-[#E4C77E]">
                {venues[0].subtitle}
              </p>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                {venues[0].description}
              </p>

              <button
                onClick={() => scrollTo("enquire")}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#42151F] transition hover:bg-[#E4C77E] hover:text-[#211B19]"
              >
                Enquire About Venue
                <ArrowUpRight size={16} />
              </button>
            </div>
          </motion.article>

          {/* Right cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {venues.slice(1).map((venue) => {
              const Icon = venue.icon;

              return (
                <motion.article
                  key={venue.title}
                  variants={fadeUp}
                  className="group relative min-h-[300px] overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_18px_50px_rgba(33,27,25,0.08)] sm:min-h-[340px] lg:min-h-0 lg:flex-1"
                >
                  <img
                    src={venue.image}
                    alt={venue.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#211B19]/95 via-[#211B19]/35 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[#E4C77E] backdrop-blur-md">
                      <Icon size={18} />
                    </div>

                    <h3 className="font-serif text-2xl text-white sm:text-3xl">
                      {venue.title}
                    </h3>

                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#E4C77E]">
                      {venue.subtitle}
                    </p>

                    <p className="mt-3 max-w-lg text-sm leading-6 text-white/65">
                      {venue.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.div>

        {/* =========================================================
            EVENT SUPPORT
        ========================================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          className="mt-24 sm:mt-28 lg:mt-36"
        >
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              variants={fadeUp}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C6A15B]/30 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8E6F35] shadow-sm backdrop-blur-md"
            >
              <Sparkles size={13} />
              Additional Arrangements
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="font-serif text-3xl leading-[1.1] tracking-tight text-[#211B19] sm:text-4xl lg:text-5xl"
            >
              Everything you need for
              <span className="block text-[#8E6F35]">your celebration.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#211B19]/60 sm:text-base"
            >
              From beautiful venue spaces and comfortable rooms to a traditional
              mandir, Triveni Bhavan offers the essential setting for your
              occasion. Additional arrangements such as sound, decoration and
              catering can also be discussed with the Triveni Bhavan team based
              on your event requirements.
            </motion.p>
          </div>

          {/* Cards */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
          >
            {eventSupport.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="group rounded-[1.75rem] border border-[#42151F]/[0.07] bg-white p-7 shadow-[0_15px_45px_rgba(33,27,25,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C6A15B]/20 hover:shadow-[0_25px_60px_rgba(33,27,25,0.08)] sm:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#42151F]/[0.05] text-[#8E6F35] transition-all duration-300 group-hover:bg-[#42151F] group-hover:text-[#E4C77E]">
                    <Icon size={20} strokeWidth={1.7} />
                  </div>

                  <h3 className="mt-6 font-serif text-xl text-[#211B19]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#211B19]/55">
                    {item.text}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-12 text-center sm:mt-14"
          >
            <p className="text-sm font-medium text-[#211B19]/70">
              Planning something special?
            </p>

            <p className="mt-1.5 text-sm text-[#211B19]/50">
              Talk to the Triveni Bhavan team about your event requirements.
            </p>

            <button
              onClick={() => scrollTo("enquire")}
              className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-[#42151F]/15 bg-white px-6 py-3.5 text-sm font-semibold text-[#42151F] shadow-[0_8px_30px_rgba(33,27,25,0.06)] transition-all duration-300 hover:border-[#C6A15B]/40 hover:bg-[#42151F] hover:text-white hover:shadow-[0_12px_35px_rgba(66,21,31,0.15)]"
            >
              Discuss Your Requirements
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </motion.div>

        {/* =========================================================
            BOTTOM CTA
        ========================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="relative mt-20 overflow-hidden rounded-[2rem] bg-[#211B19] px-6 py-10 sm:px-10 sm:py-12 lg:mt-28 lg:px-14 lg:py-14"
        >
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#C6A15B]/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-[#C6A15B]/5 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E4C77E]">
                Your Celebration Starts Here
              </p>

              <h3 className="mt-3 max-w-2xl font-serif text-3xl leading-tight text-white sm:text-4xl">
                Find the space that feels right for your occasion.
              </h3>
            </div>

            <button
              onClick={() => scrollTo("enquire")}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#E4C77E] px-6 py-3.5 text-sm font-bold text-[#211B19] transition hover:bg-white"
            >
              Enquire Now
              <ArrowUpRight size={17} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default VenueSpaces;