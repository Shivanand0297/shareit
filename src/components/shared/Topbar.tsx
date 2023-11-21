import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutMutation } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react"
import { useAuthContext } from "@/context/AuthContext"

const Topbar = () => {
  const navigate = useNavigate();
  const { mutate: handleLogout, isSuccess } = useSignOutMutation()
  const { user } = useAuthContext()

  useEffect(() => {
    if(isSuccess){
      navigate("/sign-in")
    }
  }, [isSuccess, navigate])

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/">
          <img 
            src="/assets/images/logo.svg" 
            alt="logo" 
            width={130}
            height={325}
          />
        </Link>
        <div className="flex gap-4 items-center">
          <Button onClick={() => handleLogout()} className="shad-button_ghost">
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${user.id}`} className="f1ex-center gap-3">
            <img
              src={user.imageUrl || '/assets/images/profile-placeholder.png'}
              alt="profile"
              className='h-8 w-8 rounded-full'
            />
            </Link>
        </div>
      </div>
    </section>
  )
}

export default Topbar