FROM python:3.12.2-slim-bullseye

# Set the working directory in the container
WORKDIR /usr/src/django

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install gcc and other build dependencies
RUN apt-get update && apt-get install -y \
    netcat \
    && rm -rf /var/lib/apt/lists/* 

# Upgrade pip
RUN python -m pip install --upgrade pip

# Copy requirements.txt to the working directory and install dependencies
COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY entrypoint.sh ./

RUN sed -i 's/\r$//g' entrypoint.sh

RUN chmod +x entrypoint.sh

# Copy the rest of the application code to the working directory
COPY . .

ENTRYPOINT [ "./entrypoint.sh" ]
# Run the application
CMD ["uvicorn", "backend.asgi:application", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]