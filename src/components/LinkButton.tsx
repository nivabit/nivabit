import Link from "next/link";

export default function LinkButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className='group inline-flex items-center  p-[5px]  md:p-[10px] bg-primary text-white rounded-[14px] transition duration-300'
    >
      <span
        className='mr-5 capitalize ml-4 md:ml-8 
                '
      >
        {label}
      </span>
      <div className='bg-gray-50  p-3 rounded-[8px]  justify-self-end'>
        <svg
          viewBox='0 0 18 19'
          xmlns='http://www.w3.org/2000/svg'
          className='size-4  md:size-6  transform transition-transform duration-300 ease-in-out group-hover:rotate-45 fill-secondary'
        >
          <path d='M17.5822 13.9009V2.11089C17.5822 1.39518 17.1301 0.917856 16.3892 0.917856L4.59917 0.943035C3.90864 0.943035 3.44417 1.45786 3.44417 2.04821C3.44417 2.63804 3.97131 3.14054 4.54881 3.14054H8.29078L14.2672 2.91446L11.9819 4.92339L0.76935 16.1611C0.543814 16.3871 0.418457 16.663 0.418457 16.9271C0.418457 17.5164 0.9456 18.0821 1.5606 18.0821C1.84989 18.0821 2.11346 17.9691 2.33899 17.743L13.5767 6.50536L15.5856 4.23286L15.3595 9.94571V13.9512C15.3595 14.5287 15.862 15.0559 16.4647 15.0559C17.0545 15.0559 17.5822 14.5663 17.5822 13.9009Z' />
        </svg>
      </div>
    </Link>
  );
}
