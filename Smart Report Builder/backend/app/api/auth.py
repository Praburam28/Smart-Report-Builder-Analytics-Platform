from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from app.services.auth_service import AuthService
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.audit_log_service import AuditLogService


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    try:
        user = AuthService.register_user(
            db=db,
            name=request.name,
            email=request.email,
            password=request.password,
        )
        
        AuditLogService.create_log(
            db=db,
            user_id=user.id,
            action="REGISTER",
            resource_type="USER",
            resource_id=user.id,
            description=f"User '{user.email}' registered successfully.",
        )


        return UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role.name,
            is_active=user.is_active,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    user = AuthService.authenticate_user(
        db=db,
        email=request.email,
        password=request.password,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = AuthService.generate_token(user)
    
    AuditLogService.create_log(
        db=db,
        user_id=user.id,
        action="LOGIN",
        resource_type="USER",
        resource_id=user.id,
        description=f"User '{user.email}' logged in successfully.",
    )

    return TokenResponse(
        access_token=token,
        token_type="bearer",
    )
    
@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role.name,
        is_active=current_user.is_active,
    )