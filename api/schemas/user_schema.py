from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from schemas.reviews_schema import ReviewBase


class UserModel(BaseModel):
    id: UUID
    aud: str
    role: str
    email: str | None = None
    email_confirmed_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
    is_anonymous: bool = False

class ProfileModel(BaseModel):
    user_id: UUID
    created_at: datetime
    username: str | None = None
    
class UserProfileDetails(BaseModel):
    user_id: UUID
    username: str | None
    reviews: list[ReviewBase]