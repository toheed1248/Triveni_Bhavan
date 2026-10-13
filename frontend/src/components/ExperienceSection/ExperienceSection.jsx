import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Snowflake,
  DoorOpen,
  Check,
  BedDouble,
  Bath,
} from 'lucide-react'
import { useBusinessSettings } from '../../contexts/BusinessSettingsContext'

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -35,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const fadeRight = {
  hidden: {
    opacity: 0,
    x: 35,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function ExperienceSection() {
  const { settings } = useBusinessSettings()

  const businessName = settings?.businessName || 'Triveni Bhavan'
  const yearsExperience = settings?.yearsExperience || 21

  return (
    <section
      id="about"
      className="
        relative
        overflow-hidden
        bg-[#F7F3ED]
        py-20
        sm:py-24
        lg:py-32
      "
    >

      {/* Background */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className="
            absolute
            -left-40
            top-20
            h-96
            w-96
            rounded-full
            bg-[#C6A15B]/[0.07]
            blur-[110px]
          "
        />

        <div
          className="
            absolute
            -right-40
            bottom-0
            h-[450px]
            w-[450px]
            rounded-full
            bg-[#42151F]/[0.04]
            blur-[120px]
          "
        />

      </div>

      <div
        className="
          relative
          mx-auto
          max-w-[1400px]
          px-5
          sm:px-8
          lg:px-12
        "
      >

        {/* =====================================================
            ABOUT
        ====================================================== */}

        <div
          className="
            grid
            items-center
            gap-12
            lg:grid-cols-[0.95fr_1fr]
            lg:gap-20
            xl:gap-24
          "
        >

          {/* IMAGE */}

          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: '-80px',
            }}
            className="relative"
          >

            <div
              className="
                relative
                h-[430px]
                overflow-hidden
                rounded-[28px]
                sm:h-[520px]
                lg:h-[590px]
              "
            >

              <motion.img
                src="/images/day_photo.png"
                alt={`${businessName} venue`}
                className="
                  h-full
                  w-full
                  object-cover
                "
                initial={{
                  scale: 1.08,
                }}
                whileInView={{
                  scale: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/60
                  via-transparent
                  to-transparent
                "
              />

              {/* Image label */}

              <div
                className="
                  absolute
                  bottom-5
                  left-5
                  right-5
                  sm:bottom-7
                  sm:left-7
                  sm:right-7
                  flex
                  items-end
                  justify-between
                "
              >

                <div>

                  <p
                    className="
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.3em]
                      text-white/60
                    "
                  >
                    {yearsExperience}+ Years
                  </p>

                  <p
                    className="
                      mt-1
                      font-heading
                      text-lg
                      font-medium
                      text-white
                    "
                  >
                    {businessName}
                  </p>

                </div>

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-black/20
                    backdrop-blur-md
                  "
                >
                  <ArrowUpRight
                    size={17}
                    className="text-white"
                  />
                </div>

              </div>

            </div>

            {/* Floating card */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.5,
                duration: 0.7,
              }}
              className="
                absolute
                -bottom-6
                right-4
                sm:right-8
                rounded-2xl
                border
                border-white/60
                bg-white/90
                px-5
                py-4
                shadow-[0_15px_40px_rgba(33,27,25,0.12)]
                backdrop-blur-xl
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-[#C6A15B]/15
                  "
                >
                  <Check
                    size={17}
                    className="text-[#A88745]"
                  />
                </div>

                <div>

                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.15em]
                      text-[#211B19]/40
                    "
                  >
                    Since 2005
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-sm
                      font-semibold
                      text-[#211B19]
                    "
                  >
                    {yearsExperience}+ years of memories
                  </p>

                </div>

              </div>

            </motion.div>

          </motion.div>

          {/* ABOUT CONTENT */}

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              margin: '-80px',
            }}
          >

            {/* Eyebrow */}

            <div
              className="
                mb-5
                flex
                items-center
                gap-3
              "
            >

              <span className="h-px w-9 bg-[#C6A15B]" />

              <p
                className="
                  text-[10px]
                  sm:text-xs
                  font-medium
                  uppercase
                  tracking-[0.3em]
                  text-[#A88745]
                "
              >
                About Triveni Bhavan
              </p>

            </div>

            {/* Heading */}

            <h2
              className="
                font-heading
                text-3xl
                leading-[1.1]
                tracking-tight
                text-[#211B19]
                sm:text-4xl
                lg:text-[3.35rem]
              "
            >
              21 years of
              <span className="block text-[#8E6F35]">
                celebrations & memories.
              </span>
            </h2>

            {/* Description */}

            <div
              className="
                mt-6
                max-w-xl
                space-y-4
                text-[15px]
                leading-[1.8]
                text-[#211B19]/60
                sm:text-base
              "
            >

              <p>
                For more than {yearsExperience} years, {businessName} has been
                a place where families come together to celebrate
                weddings, functions, gatherings and meaningful occasions.
              </p>

              <p>
                With spacious event areas, a traditional Mandir,
                comfortable guest rooms and essential event facilities,
                {businessName} brings together the spaces you need
                for a memorable celebration.
              </p>

              <p>
                The temple and heritage surroundings add a distinctive
                traditional character, keeping celebrations connected
                to culture and tradition.
              </p>

            </div>

            {/* =================================================
                QUICK FACTS
            ================================================== */}

            <div
              className="
                mt-8
                grid
                grid-cols-3
                gap-3
                border-y
                border-[#211B19]/[0.08]
                py-6
              "
            >

              <div>

                <p
                  className="
                    font-heading
                    text-xl
                    font-semibold
                    text-[#42151F]
                    sm:text-2xl
                  "
                >
                  {yearsExperience}+
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    uppercase
                    tracking-[0.12em]
                    text-[#211B19]/40
                  "
                >
                  Years
                </p>

              </div>

              <div
                className="
                  border-l
                  border-[#211B19]/10
                  pl-4
                "
              >

                <p
                  className="
                    font-heading
                    text-xl
                    font-semibold
                    text-[#42151F]
                    sm:text-2xl
                  "
                >
                  18
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    uppercase
                    tracking-[0.12em]
                    text-[#211B19]/40
                  "
                >
                  Rooms
                </p>

              </div>

              <div
                className="
                  border-l
                  border-[#211B19]/10
                  pl-4
                "
              >

                <p
                  className="
                    font-heading
                    text-xl
                    font-semibold
                    text-[#42151F]
                    sm:text-2xl
                  "
                >
                  14
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    uppercase
                    tracking-[0.12em]
                    text-[#211B19]/40
                  "
                >
                  AC Rooms
                </p>

              </div>

            </div>

            {/* CTA */}

            <div className="mt-8">

              <a
                href="#venue"
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  bg-[#42151F]
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  text-[#F7F3ED]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#541B28]
                  hover:shadow-[0_12px_30px_rgba(66,21,31,0.18)]
                "
              >

                Discover Our Spaces

                <span
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                  "
                >
                  <ArrowUpRight size={14} />
                </span>

              </a>

            </div>

          </motion.div>

        </div>

        {/* =====================================================
            GUEST ACCOMMODATION
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: '-60px',
          }}
          transition={{
            duration: 0.8,
          }}
          className="
            mt-28
            overflow-hidden
            rounded-[28px]
            border
            border-[#211B19]/[0.07]
            bg-white
            shadow-[0_15px_50px_rgba(33,27,25,0.05)]
            sm:mt-32
          "
        >

          <div
            className="
              grid
              lg:grid-cols-[0.85fr_1.15fr]
            "
          >

            {/* Accommodation heading */}

            <div
              className="
                relative
                overflow-hidden
                bg-[#42151F]
                p-7
                sm:p-10
                lg:p-12
              "
            >

              <div
                className="
                  absolute
                  -right-20
                  -top-20
                  h-48
                  w-48
                  rounded-full
                  bg-[#C6A15B]/10
                  blur-3xl
                "
              />

              <div className="relative">

                <div className="mb-4 flex items-center gap-3">

                  <BedDouble
                    size={18}
                    className="text-[#E4C77E]"
                  />

                  <span
                    className="
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.25em]
                      text-[#E4C77E]
                    "
                  >
                    Guest Accommodation
                  </span>

                </div>

                <h3
                  className="
                    font-heading
                    text-2xl
                    font-semibold
                    leading-tight
                    text-white
                    sm:text-3xl
                  "
                >
                  Comfortable rooms
                  <span className="block text-[#E4C77E]">
                    for your guests.
                  </span>
                </h3>

                <p
                  className="
                    mt-4
                    max-w-sm
                    text-sm
                    leading-relaxed
                    text-white/55
                  "
                >
                  {businessName} offers 18 rooms with
                  different accommodation options to suit
                  your guests' requirements.
                </p>

              </div>

            </div>

            {/* Room details */}

            <div
              className="
                grid
                grid-cols-1
                gap-px
                bg-[#211B19]/[0.06]
                sm:grid-cols-2
              "
            >

              {/* AC */}

              <div
                className="
                  bg-white
                  p-7
                  sm:p-8
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#42151F]/[0.06]
                    "
                  >
                    <Snowflake
                      size={18}
                      className="text-[#42151F]"
                    />
                  </div>

                  <div>

                    <p
                      className="
                        text-2xl
                        font-semibold
                        text-[#42151F]
                      "
                    >
                      14
                    </p>

                    <p
                      className="
                        text-xs
                        text-[#211B19]/45
                      "
                    >
                      AC Rooms
                    </p>

                  </div>

                </div>

                <div
                  className="
                    mt-5
                    h-px
                    bg-[#211B19]/[0.07]
                  "
                />

                <p
                  className="
                    mt-4
                    text-xs
                    leading-relaxed
                    text-[#211B19]/50
                  "
                >
                  Air-conditioned rooms for comfortable
                  guest accommodation.
                </p>

              </div>

              {/* Non AC */}

              <div
                className="
                  bg-white
                  p-7
                  sm:p-8
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#42151F]/[0.06]
                    "
                  >
                    <DoorOpen
                      size={18}
                      className="text-[#42151F]"
                    />
                  </div>

                  <div>

                    <p
                      className="
                        text-2xl
                        font-semibold
                        text-[#42151F]
                      "
                    >
                      4
                    </p>

                    <p
                      className="
                        text-xs
                        text-[#211B19]/45
                      "
                    >
                      Non-AC Rooms
                    </p>

                  </div>

                </div>

                <div
                  className="
                    mt-5
                    h-px
                    bg-[#211B19]/[0.07]
                  "
                />

                <p
                  className="
                    mt-4
                    text-xs
                    leading-relaxed
                    text-[#211B19]/50
                  "
                >
                  Additional rooms for flexible
                  accommodation requirements.
                </p>

              </div>

              {/* Toilet */}

              <div
                className="
                  bg-white
                  p-7
                  sm:p-8
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#42151F]/[0.06]
                    "
                  >
                    <Bath
                      size={18}
                      className="text-[#42151F]"
                    />
                  </div>

                  <div>

                    <p
                      className="
                        text-2xl
                        font-semibold
                        text-[#42151F]
                      "
                    >
                      14
                    </p>

                    <p
                      className="
                        text-xs
                        text-[#211B19]/45
                      "
                    >
                      With Toilet
                    </p>

                  </div>

                </div>

                <div
                  className="
                    mt-5
                    h-px
                    bg-[#211B19]/[0.07]
                  "
                />

                <p
                  className="
                    mt-4
                    text-xs
                    leading-relaxed
                    text-[#211B19]/50
                  "
                >
                  Rooms equipped with an attached
                  toilet for added convenience.
                </p>

              </div>

              {/* Without toilet */}

              <div
                className="
                  bg-white
                  p-7
                  sm:p-8
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#42151F]/[0.06]
                    "
                  >
                    <DoorOpen
                      size={18}
                      className="text-[#42151F]"
                    />
                  </div>

                  <div>

                    <p
                      className="
                        text-2xl
                        font-semibold
                        text-[#42151F]
                      "
                    >
                      4
                    </p>

                    <p
                      className="
                        text-xs
                        text-[#211B19]/45
                      "
                    >
                      Without Toilet
                    </p>

                  </div>

                </div>

                <div
                  className="
                    mt-5
                    h-px
                    bg-[#211B19]/[0.07]
                  "
                />

                <p
                  className="
                    mt-4
                    text-xs
                    leading-relaxed
                    text-[#211B19]/50
                  "
                >
                  Rooms available for guests who prefer
                  flexible accommodation arrangements.
                </p>

              </div>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  )
}