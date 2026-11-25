from supabase import Client
from schemas.reviews_schema import ReviewBase
from schemas.user_schema import ProfileModel, UserProfileDetails
from fastapi import HTTPException, status
class UserService:
    def __init__(self, supabase: Client):
        self.supabase = supabase
    async def make_profile_for_db(self, id: str, username: str):
        try:
            response = (
                self.supabase.table("profiles")
                .insert({
                    "user_id": str(id),
                    "username": username
                })
                .execute()
            )
            if not response.data:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to create profile"
                )

            return {"ok": True}
        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail="Database error while creating profile"
            )
    # This gets a users profile from the database when a session exists.
    async def get_profile_from_db(self, id: str) -> dict[ProfileModel]:
        try:
            response = (self.supabase.table("profiles")
            .select("*")
            .eq('user_id', str(id))
            .execute())
            if not response.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Profile not found"
                )
            return ProfileModel(
                user_id=response.data[0]["user_id"],
                created_at=response.data[0]["created_at"],
                username=response.data[0]["username"],
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error."
            )
    # NOT TO GET MISTAKEN WITH ONE ABOVE. this is meant for /profile/username to display info
    async def get_profile_for_endpoint(self, username: str) -> dict[UserProfileDetails]:
        try:
            response = (self.supabase.table("profiles")
            .select("*")
            .eq('username', str(username))
            .execute())
            if not response.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                )
            user_id = response.data[0]["user_id"]
            response_reviews = (self.supabase.table("reviews")
            .select("*, courses(full_code)")
            .eq('user_id', str(user_id))
            .execute())
            return UserProfileDetails(
            user_id=user_id,
            username=response.data[0]["username"],
            reviews=[
                ReviewBase(
                    **review,
                    full_code=(review["courses"] or {}).get("full_code")
                )
                for review in response_reviews.data
            ]
        )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error."
            )
        