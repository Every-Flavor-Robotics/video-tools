from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Ensure database directory exists
DB_DIR = os.path.join(os.path.dirname(__file__), "../data")
os.makedirs(DB_DIR, exist_ok=True)

DATABASE_URL = f"sqlite:///{DB_DIR}/jobs.db"

# Initialize DB
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Define Job Model
class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, index=True)
    input_file = Column(String, nullable=False)
    output_file = Column(String, nullable=True)
    status = Column(String, default="uploaded")
    error = Column(String, nullable=True)


# Create database tables
Base.metadata.create_all(bind=engine)
