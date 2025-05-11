"use client";

import React, { useState, useEffect } from 'react';
import './courses.css';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const itemsPerPage = 100;

  useEffect(() => {
    // Fetch course data from the JSON file
    fetch('/course_data.json') // Updated path to reflect the file being in the public folder
      .then((response) => response.json())
      .then((data) => setCourses(data));
  }, []);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key, isNumeric = false) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction, isNumeric });
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const filteredCourses = courses.filter((course) => {
    return course.title && course.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = sortConfig.isNumeric ? parseFloat(a[sortConfig.key]) : a[sortConfig.key];
      const bValue = sortConfig.isNumeric ? parseFloat(b[sortConfig.key]) : b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const paginatedCourses = sortedCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  return (
    <div className={`container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <h1>RDS2.2</h1>

      <div className="mode-toggle" style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <button onClick={toggleDarkMode} style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', backgroundColor: isDarkMode ? '#333' : '#ddd', color: isDarkMode ? '#fff' : '#000' }}>
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th onClick={() => handleSort('code', true)}>
              Code {sortConfig.key === 'code' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('title')}>
              Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('section', true)}>
              Section {sortConfig.key === 'section' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('faculty_initial')}>
              Faculty {sortConfig.key === 'faculty_initial' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('time')}>
              Time {sortConfig.key === 'time' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('room')}>
              Room {sortConfig.key === 'room' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('seat', true)}>
              Seats {sortConfig.key === 'seat' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('Semester')}>
              Semester {sortConfig.key === 'Semester' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedCourses.map((course, index) => (
            <tr key={index}>
              <td>{course.code}</td>
              <td>{course.title}</td>
              <td>{course.section}</td>
              <td>{course.faculty_initial}</td>
              <td>{course.time}</td>
              <td>{course.room}</td>
              <td>{course.seat}</td>
              <td>{course.Semester}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
