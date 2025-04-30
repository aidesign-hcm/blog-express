'use client'

import authApiRequest from '@/apiRequests/auth'
import { useAppContext } from '@/app/app-provider'
import { Button } from '@/components/ui/button'
import { handleErrorApi } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from "react-toastify";

export default function ButtonLogout() {
  const { setUser } = useAppContext()
  const router = useRouter()
  const pathname = usePathname()
  const handleLogout = async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer()
      router.push('/login')
      toast.success("Logout successful!");
    } catch (error) {
      handleErrorApi({
        error
      })
      authApiRequest.logoutFromNextClientToNextServer(true).then((res) => {
        router.push(`/login?redirectFrom=${pathname}`)
      })
    } finally {
      setUser(null)
      router.refresh()
      localStorage.removeItem("user");
      localStorage.removeItem('sessionToken')
      localStorage.removeItem('sessionTokenExpiresAt')
      window.location.href = window.location.origin;
    }
  }
  return (
    <button className="btn btn-sm btn-primary my-4" onClick={handleLogout}>
      Đăng xuất
    </button>
  )
}