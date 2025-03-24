import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "react-feather";
import React, { useState } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [show, setShow] = useState(false)
    return (
      <>
      <div className="relative w-full">
        <input
          type={type === 'password' && show ? 'text' : type}
          autoComplete={type === 'password' ? 'new-password' : ''}
          className={cn(
            "input input-bordered w-full rounded-md",
            className
          )}
          ref={ref}
          {...props}
        />
        {type === 'password' && (
          show ? (
            <EyeOff 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShow(!show)} 
            />
          ) : (
            <Eye 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShow(!show)} 
            />
          )
        )}
        </div>
      </>
    )
  }
)
Input.displayName = "Input"

export { Input }
