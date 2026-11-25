from typing import Annotated
from fastapi import APIRouter, Depends, Path
from dep.supabase import get_user, get_supabase, get_supabase_public
from services.user_service import UserService
from schemas.user_schema import UserModel
router = APIRouter(prefix="/user")
# This is to MAKE a users profile once they register
@router.post("/create/{username}")
async def make_profile(
    username: Annotated[str, Path(min_length=1, max_length=15, description = "Username generated on frontend")],
    user: UserModel  = Depends(get_user),
    supabase = Depends(get_supabase)
):
    service = UserService(supabase=supabase)
    return await service.make_profile_for_db(user.id, username)

# This is for getting any users session that exists
@router.get("/profile")
async def get_profile(
    user: UserModel  = Depends(get_user),
    supabase = Depends(get_supabase)
):
    service = UserService(supabase=supabase)
    return await service.get_profile_from_db(user.id)
#This is to get every profile for a username whne someone vists /profile/username
@router.get("/profile/{username}")
async def get_profile(
    username: Annotated[str, Path(min_length=1, max_length=15, description = "Username from a users page")],
    supabase = Depends(get_supabase_public)
):
    service = UserService(supabase=supabase)
    return await service.get_profile_for_endpoint(username=username)
