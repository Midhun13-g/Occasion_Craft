@echo off
echo Creating categories table in MySQL...
echo.

REM Update these paths if your MySQL is installed elsewhere
set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
set DB_USER=admin_user
set DB_PASS=Midhun@Indhu2022
set DB_NAME=occasion_dp

REM Check if mysql exists
if not exist %MYSQL_PATH% (
    echo MySQL not found at %MYSQL_PATH%
    echo Please update MYSQL_PATH in this script or run the SQL manually
    echo.
    echo SQL file location: CREATE_CATEGORIES_TABLE.sql
    pause
    exit /b 1
)

REM Run the SQL script
%MYSQL_PATH% -u %DB_USER% -p%DB_PASS% %DB_NAME% < CREATE_CATEGORIES_TABLE.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo SUCCESS! Categories table created successfully.
    echo.
) else (
    echo.
    echo ERROR! Failed to create categories table.
    echo Please run the SQL script manually using MySQL Workbench or command line.
    echo.
)

pause
