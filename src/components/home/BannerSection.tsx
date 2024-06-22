"use client";

import Image from "next/image";
import BannerImage from "../../../public/banner-img.png";

import Link from "next/link";
import HoverCard from "../HoverCard";
import Container from "../ui/container";

export default function BannerSection() {
  return (
    <Container>
      <div className='min-h-screen max-h-[60vh]  lg:min-h-0 lg:mt-48 mt-28  '>
        <div>
          <div className='flex   flex-col-reverse lg:flex-row items-center justify-between sm:gap-20 md:gap-6'>
            <div className='flex  flex-col items-start md:block  space-y-5 w-full lg:w-1/2  text-start mt-0 md:mb-20'>
              <h2 className=' text-[35px] md:text-[50px] lg:text-[80px]   font-extrabold text-primary capitalize  leading-tight  font-sans'>
                Transforming <br />
                Ideas Into{" "}
                <span className='text-primary opacity-70'>usable Products</span>
              </h2>
              <p className='text-start  font-normal text-gray-900 mt-0 my-10'>
                Transform your digital aspirations into reality with Nivabit. We
                specialize in crafting <br />
                bespoke digital solutions that elevate your brand and drive
                success.
              </p>
              <Link
                href='/#contact-us'
                className='group inline-flex items-center p-2 bg-primary text-white rounded-2xl transition duration-300'
              >
                <span
                  className='mr-5 capitalize ml-8 
                '
                >
                  let&apos;s talk
                </span>
                <div className='bg-gray-50  p-3 rounded-2xl  justify-self-end'>
                  <svg
                    width='18'
                    height='19'
                    viewBox='0 0 18 19'
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-6 h-6 transform transition-transform duration-300 ease-in-out group-hover:rotate-45 fill-secondary'
                  >
                    <path d='M17.5822 13.9009V2.11089C17.5822 1.39518 17.1301 0.917856 16.3892 0.917856L4.59917 0.943035C3.90864 0.943035 3.44417 1.45786 3.44417 2.04821C3.44417 2.63804 3.97131 3.14054 4.54881 3.14054H8.29078L14.2672 2.91446L11.9819 4.92339L0.76935 16.1611C0.543814 16.3871 0.418457 16.663 0.418457 16.9271C0.418457 17.5164 0.9456 18.0821 1.5606 18.0821C1.84989 18.0821 2.11346 17.9691 2.33899 17.743L13.5767 6.50536L15.5856 4.23286L15.3595 9.94571V13.9512C15.3595 14.5287 15.862 15.0559 16.4647 15.0559C17.0545 15.0559 17.5822 14.5663 17.5822 13.9009Z' />
                  </svg>
                </div>
              </Link>
            </div>
            <div className='relative py-12 lg:py-20'>
              <div
                className="relative z-[-1] flex place-items-center before:absolute before:h-[150px] before:-translate-y-[-3%] before:rounded-full 
            md:before:-translate-x-[40%] before:-translate-x-[30%] before:bg-gradient-radial before:from-orange-500  before:blur-[85px] before:content-[''] before:bg-gradient-to-br md:before:w-[200px] before:w-[150px]"
              ></div>
              <div className='rounded-2xl p-4 border bg-white lg:mr-24'>
                <Image
                  src={BannerImage}
                  alt='man with computer'
                  className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70]  '
                />
              </div>
              <HoverCard
                className='absolute top-[12rem] -left-[1.5rem] md:-left-10  md:top-72'
                icon={
                  <svg
                    className='group-hover:mt-1 size-6 '
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M3.38766 20.7632L3.77953 20.1237L3.38766 20.7632ZM1.73695 19.1125L2.37643 18.7206H2.37643L1.73695 19.1125ZM20.2634 19.1125L19.6239 18.7206L20.2634 19.1125ZM18.6126 20.7632L18.2208 20.1237L18.6126 20.7632ZM18.6126 5.2368L18.2208 5.87628L18.6126 5.2368ZM20.2634 6.88751L19.6239 7.27938L20.2634 6.88751ZM3.38766 5.2368L3.77953 5.87628H3.77953L3.38766 5.2368ZM1.73695 6.88751L2.37643 7.27938H2.37643L1.73695 6.88751ZM17.4769 2.04645L18.0182 1.52728V1.52728L17.4769 2.04645ZM2.84437 2.39079L3.29721 2.98865V2.98865L2.84437 2.39079ZM1.85459 3.42267L2.46991 3.85148L1.85459 3.42267ZM18.0002 4.63032H18.7502L18.7501 4.62662L18.0002 4.63032ZM17.3638 13.1137C17.778 13.1137 18.1138 12.7779 18.1138 12.3637C18.1138 11.9494 17.778 11.6137 17.3638 11.6137V13.1137ZM14.6365 11.6137C14.2223 11.6137 13.8865 11.9494 13.8865 12.3637C13.8865 12.7779 14.2223 13.1137 14.6365 13.1137V11.6137ZM9.50015 5.25H12.5002V3.75H9.50015V5.25ZM12.5002 20.75H9.50015V22.25H12.5002V20.75ZM9.50015 20.75C7.84891 20.75 6.66315 20.7492 5.73824 20.6613C4.82449 20.5744 4.24306 20.4078 3.77953 20.1237L2.99578 21.4027C3.7346 21.8554 4.57271 22.0572 5.59626 22.1545C6.60865 22.2508 7.87796 22.25 9.50015 22.25V20.75ZM0.25015 13C0.25015 14.6222 0.249359 15.8915 0.345618 16.9039C0.442937 17.9274 0.644719 18.7655 1.09747 19.5044L2.37643 18.7206C2.09238 18.2571 1.92576 17.6757 1.83888 16.7619C1.75094 15.837 1.75015 14.6512 1.75015 13H0.25015ZM3.77953 20.1237C3.20767 19.7733 2.72687 19.2925 2.37643 18.7206L1.09747 19.5044C1.57159 20.2781 2.22209 20.9286 2.99578 21.4027L3.77953 20.1237ZM12.5002 22.25C14.1223 22.25 15.3917 22.2508 16.404 22.1545C17.4276 22.0572 18.2657 21.8554 19.0045 21.4027L18.2208 20.1237C17.7572 20.4078 17.1758 20.5744 16.2621 20.6613C15.3371 20.7492 14.1514 20.75 12.5002 20.75V22.25ZM19.6239 18.7206C19.2734 19.2925 18.7926 19.7733 18.2208 20.1237L19.0045 21.4027C19.7782 20.9286 20.4287 20.2781 20.9028 19.5044L19.6239 18.7206ZM18.2208 5.87628C18.7926 6.22672 19.2734 6.70752 19.6239 7.27938L20.9028 6.49563C20.4287 5.72194 19.7782 5.07144 19.0045 4.59732L18.2208 5.87628ZM9.50015 3.75C7.87796 3.75 6.60865 3.74921 5.59626 3.84547C4.57271 3.94279 3.7346 4.14457 2.99578 4.59732L3.77953 5.87628C4.24306 5.59223 4.82449 5.42561 5.73824 5.33873C6.66315 5.25079 7.84891 5.25 9.50015 5.25V3.75ZM1.75015 13C1.75015 11.3488 1.75094 10.163 1.83888 9.23809C1.92576 8.32434 2.09238 7.74291 2.37643 7.27938L1.09747 6.49563C0.644719 7.23445 0.442937 8.07256 0.345618 9.09611C0.249359 10.1085 0.25015 11.3778 0.25015 13H1.75015ZM2.99578 4.59732C2.22209 5.07144 1.57159 5.72194 1.09747 6.49563L2.37643 7.27938C2.72687 6.70752 3.20767 6.22672 3.77953 5.87628L2.99578 4.59732ZM9.05322 2.25H14.4219V0.75H9.05322V2.25ZM14.4219 2.25C15.2876 2.25 15.8583 2.25173 16.2815 2.31105C16.6798 2.36687 16.8347 2.46039 16.9357 2.56562L18.0182 1.52728C17.595 1.08606 17.066 0.906351 16.4897 0.825567C15.9382 0.748272 15.2435 0.75 14.4219 0.75V2.25ZM9.05322 0.75C7.39302 0.75 6.08509 0.748882 5.04743 0.866088C3.99381 0.985096 3.12984 1.2337 2.39153 1.79293L3.29721 2.98865C3.73494 2.65709 4.29779 2.4603 5.21579 2.35661C6.14974 2.25112 7.35822 2.25 9.05322 2.25V0.75ZM1.75015 9.89563C1.75015 8.13063 1.7511 6.86468 1.85294 5.88472C1.9535 4.91704 2.14565 4.31679 2.46991 3.85148L1.23928 2.99385C0.7091 3.75462 0.47402 4.64188 0.360973 5.72968C0.249202 6.8052 0.25015 8.1627 0.25015 9.89563H1.75015ZM2.39153 1.79293C1.94821 2.12872 1.5596 2.53422 1.23928 2.99385L2.46991 3.85148C2.70149 3.51918 2.98091 3.22823 3.29721 2.98865L2.39153 1.79293ZM18.7501 4.62662C18.7468 3.94995 18.7324 3.36358 18.6476 2.87747C18.5596 2.37228 18.3855 1.91025 18.0182 1.52728L16.9357 2.56562C17.029 2.66295 17.1132 2.80988 17.1699 3.13506C17.2299 3.47932 17.2468 3.94473 17.2502 4.63403L18.7501 4.62662ZM0.25015 9.89563C0.25015 10.8713 0.22999 11.7642 0.250407 12.5202L1.74986 12.4798C1.7301 11.7482 1.75015 10.924 1.75015 9.89563H0.25015ZM20.5001 14.3409H14.6365V15.8409H20.5001V14.3409ZM11.1592 12.3637C11.1592 14.2841 12.7161 15.8409 14.6365 15.8409V14.3409C13.5445 14.3409 12.6592 13.4557 12.6592 12.3637H11.1592ZM12.6592 12.3637C12.6592 11.2716 13.5445 10.3864 14.6365 10.3864V8.88638C12.7161 8.88638 11.1592 10.4432 11.1592 12.3637H12.6592ZM17.3638 11.6137H14.6365V13.1137H17.3638V11.6137ZM12.5002 5.25C13.8848 5.25 14.9451 5.25032 15.8037 5.3033C16.6614 5.35623 17.2611 5.45942 17.7339 5.63895L18.2664 4.23667C17.5863 3.97839 16.8121 3.86267 15.896 3.80615C14.9808 3.74968 13.8675 3.75 12.5002 3.75V5.25ZM17.7339 5.63895C17.9109 5.70619 18.0712 5.7846 18.2208 5.87628L19.0045 4.59732C18.7711 4.45427 18.5262 4.33534 18.2664 4.23667L17.7339 5.63895ZM17.2502 4.63032V4.93781H18.7502V4.63032H17.2502ZM14.6365 10.3864H20.9446V8.88638H14.6365V10.3864ZM21.7502 13C21.7502 11.6255 21.7505 10.5077 21.6931 9.58959L20.196 9.68316C20.2498 10.5439 20.2502 11.608 20.2502 13H21.7502ZM21.6931 9.58959C21.6147 8.33476 21.4249 7.34749 20.9028 6.49563L19.6239 7.27938C19.9528 7.8161 20.1225 8.50707 20.196 9.68316L21.6931 9.58959ZM20.2502 13C20.2502 13.7875 20.2501 14.4722 20.2401 15.0785L21.7399 15.1034C21.7502 14.4821 21.7502 13.7839 21.7502 13H20.2502ZM20.2401 15.0785C20.2075 17.037 20.0636 18.0031 19.6239 18.7206L20.9028 19.5044C21.583 18.3944 21.7079 17.0313 21.7399 15.1034L20.2401 15.0785ZM20.5001 15.8409H20.99V14.3409H20.5001V15.8409Z' />
                  </svg>
                }
                title='Cost-Effective Quality'
                content='Great service without compromising your budget.'
              />
              <HoverCard
                className='absolute top-[6.5rem] md:top-[7.5rem] -right-[1.16rem]  md:-right-[0.16rem] '
                icon={
                  <svg
                    className='group-hover:mt-1 size-6  '
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M12.75 8.25C12.75 7.83579 12.4142 7.5 12 7.5C11.5858 7.5 11.25 7.83579 11.25 8.25H12.75ZM9.4543 14.8568C9.17015 15.1582 9.18412 15.6329 9.4855 15.917C9.78689 16.2012 10.2616 16.1872 10.5457 15.8858L9.4543 14.8568ZM2.53148 2.66435C2.20803 2.92311 2.15559 3.39507 2.41435 3.71852C2.67311 4.04197 3.14507 4.09441 3.46852 3.83565L2.53148 2.66435ZM5.96852 1.83565C6.29197 1.57689 6.34441 1.10493 6.08565 0.781479C5.82689 0.458032 5.35493 0.405591 5.03148 0.664348L5.96852 1.83565ZM20.5315 3.83565C20.8549 4.09441 21.3269 4.04197 21.5857 3.71852C21.8444 3.39507 21.792 2.92311 21.4685 2.66435L20.5315 3.83565ZM18.9685 0.664348C18.6451 0.405591 18.1731 0.458032 17.9143 0.781479C17.6556 1.10493 17.708 1.57689 18.0315 1.83565L18.9685 0.664348ZM11.4552 13.8278L10.9095 13.3133L11.4552 13.8278ZM11.25 8.25V12.4558H12.75V8.25H11.25ZM10.5457 15.8858L12.0009 14.3423L10.9095 13.3133L9.4543 14.8568L10.5457 15.8858ZM3.46852 3.83565L5.96852 1.83565L5.03148 0.664348L2.53148 2.66435L3.46852 3.83565ZM21.4685 2.66435L18.9685 0.664348L18.0315 1.83565L20.5315 3.83565L21.4685 2.66435ZM21.25 12.25C21.25 17.3586 17.1086 21.5 12 21.5V23C17.9371 23 22.75 18.1871 22.75 12.25H21.25ZM12 21.5C6.89137 21.5 2.75 17.3586 2.75 12.25H1.25C1.25 18.1871 6.06294 23 12 23V21.5ZM2.75 12.25C2.75 7.14136 6.89137 3 12 3V1.5C6.06294 1.5 1.25 6.31294 1.25 12.25H2.75ZM12 3C17.1086 3 21.25 7.14136 21.25 12.25H22.75C22.75 6.31294 17.9371 1.5 12 1.5V3ZM11.25 12.4558C11.25 12.7746 11.1282 13.0814 10.9095 13.3133L12.0009 14.3423C12.482 13.832 12.75 13.1572 12.75 12.4558H11.25Z' />
                  </svg>
                }
                title='Swift Solutions'
                content='Prompt service delivery for quick, efficient solutions.'
              />
              <HoverCard
                className='absolute  -right-[0.84rem] md:right-[2.84rem]  top-[19rem] md:top-[30rem]'
                icon={
                  <svg
                    className='size-6 stroke-secondary fill-none group-hover:mt-1 group-hover:stroke-primary'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M2.5091 14.9015C2.66617 14.8618 2.83063 14.8408 3 14.8408C4.10457 14.8408 5 15.7362 5 16.8408V18.8408C5 19.9454 4.10457 20.8408 3 20.8408C1.89543 20.8408 1 19.9454 1 18.8408V16.8408C1 15.9056 1.64187 15.1203 2.5091 14.9015ZM2.5091 14.9015L2.39658 14.1514C1.61838 8.9633 5.10139 4.09509 10.2629 3.15664C11.4115 2.94779 12.5885 2.94779 13.7371 3.15664C18.8986 4.09509 22.3816 8.9633 21.6034 14.1514L21.4909 14.9015M21.4909 14.9015C21.3338 14.8618 21.1694 14.8408 21 14.8408C19.8954 14.8408 19 15.7362 19 16.8408V18.8408C19 19.9454 19.8954 20.8408 21 20.8408C22.1046 20.8408 23 19.9454 23 18.8408V16.8408C23 15.9056 22.3581 15.1203 21.4909 14.9015Z'
                      strokeWidth='1.5'
                    />
                  </svg>
                }
                title='On-Demand Support'
                content='Access assistance around the clock, whenever you need it.'
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
