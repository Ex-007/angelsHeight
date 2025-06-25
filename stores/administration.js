import { defineStore } from "pinia";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  orderBy,
  addDoc,
  documentId,
} from "firebase/firestore";

export const useAdminStore = defineStore("admin", () => {
  const isLoading = ref(false);
  const error = ref(null);
  const transSaveSuccess = ref(null);
  const resultUploadData = ref(null);
  const canOut = ref(false);
  const formStudents = ref([]);
  const paymentsIn = ref([]);
  const allAdmitted = ref([]);
  const selectedUser = ref(null);
  const isLoggedIn = ref(false);
  const loggedAdmin = ref(null);
  const isBypass = ref(false);
  const updateInfoDataSuccess = ref(false);
  const searchDataa = ref(null);
  const updateSearch = ref(null);
  const isUpdating = ref(false);
  const isFetching = ref(false);
  const imageUploaded = ref(false);
  const courseLists = ref([]);
  const paymentsDataL = ref(null);
  const results = ref([]);
  const noResults = ref(false);
  const transcriptData = ref([]);
  const grades = ref(null)
  const gPoint = ref(null)
  // AH/DE/25/2-0049

  // FETCH THE SIGNED IN USER
  const signinUser = async () => {
    isLoading.value = true;
    error.value = null;
    isBypass.value = false;
    const client = useSupabaseClient();
    isLoggedIn.value = false;

    try {
      const { data: loggedUserData, error: loggedUserError } =
        await client.auth.getUser();

      if (loggedUserError) {
        if (loggedUserError.code === "PGRST116") {
          error.value = "No user logged in";
          // console.log('not signed in')
          isBypass.value = true;
          return null;
        }
        throw loggedUserError;
      }

      if (loggedUserData && loggedUserData.user) {
        loggedAdmin.value = loggedUserData.user.user_metadata;
        isLoggedIn.value = true;
        // console.log("User data:", loggedUserData.user.user_metadata)
        return loggedUserData.user;
      } else {
        // console.log("No user data found:", loggedUserData)
        return null;
      }
    } catch (err) {
      // console.error("Error in signinUser:", err)
      error.value = err.message;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // SAVE TRANSACTION ID TO THE CLOUD
  const transactioDetails = async (transactionDet) => {
    isLoading.value = true;
    error.value = null;
    const client = useSupabaseClient();
    try {
      const { data, error: checkError } = await client
        .from("TRANSACTIONID")
        .insert([
          {
            pay_identity: transactionDet.identity,
            name: transactionDet.name,
            email: transactionDet.email,
          },
        ]);
      if (checkError) throw checkError;
      transSaveSuccess.value = "Uploaded Successfully";
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  // SAVE ADMITTED STUDENTS TO THE CLOUD
  const admittedStudentss = async (admission) => {
    isLoading.value = true;
    error.value = null;
    const client = useSupabaseClient();
    try {
      const { data, error: adminError } = await client
        .from("ADMITTEDSTUDENTS")
        .insert([
          {
            pay_identity: admission.identity,
            firstname: admission.firstname,
            middlename: admission.middlename,
            lastname: admission.lastname,
            email: admission.email,
            phone: admission.phone,
            matricNo: admission.matricNo,
            department: admission.department,
            faculty: admission.faculty,
          },
        ]);
      if (adminError) throw adminError;
      transSaveSuccess.value = "Uploaded Successfully";
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  // SIGNOUT
  const logOut = async () => {
    isLoading.value = true;
    error.value = null;
    canOut.value = false;
    const client = useSupabaseClient();
    try {
      const { data: signoutData, error: signoutError } =
        await client.auth.signOut();
      if (signoutError) throw signoutError;
      canOut.value = true;
    } catch (err) {
      error.value = err.message;
    }
  };

  // FETCH NEWLY REGISTERED STUDENTS
  const fetchRegistered = async () => {
    isLoading.value = false;
    error.value = null;
    const client = useSupabaseClient();
    try {
      const { data: fetchData, error: fetchError } = await client
        .from("studentform")
        .select("id, firstname, middlename, surname, created_at")
        .order("created_at", {
          ascending: false,
        });

      if (fetchError) throw fetchError;
      formStudents.value = fetchData;
    } catch (err) {
      error.value = err.message;
    }
  };

  //SEARCH SELECTED USERS
  const selectUser = async (userId) => {
    const client = useSupabaseClient();
    try {
      if (selectedUser.value && selectedUser.value?.id === "userId") {
        selectedUser.value = null;
        return;
      }
      const { data: formData, error: formError } = await client
        .from("studentform")
        .select("*")
        .eq("id", userId)
        .single();

      if (formError) throw formError;
      selectedUser.value = formData;
    } catch (err) {
      error.value = err.message;
    }
  };

  //  UPLOAD STUDENT'S RESULT
  const uploadResult = async (studentDet) => {
    isLoading.value = true;
    error.value = false;
    const client = useSupabaseClient();
    try {
      const { data: resultUploadData, error: resultUploadError } = await client
        .from("STUDENTRECORDS")
        .insert([
          {
            name: studentDet.name,
            assmt: studentDet.assmt,
            cc: studentDet.courseCode,
            coursecode: studentDet.courseTitle,
            cu: studentDet.cu,
            exam: studentDet.exam,
            level: studentDet.level,
            matricNo: studentDet.matricNo,
            practical: studentDet.practical,
            semester: studentDet.semester,
            test: studentDet.test,
            total: studentDet.total,
            year: studentDet.year,
          },
        ]);
      if (resultUploadError) throw resultUploadError;
      resultUploadData.value = "Successfully Uploaded";
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  // SEARCH FOR STUDENT ADMISSION BEFORE UPLOADING RESULT
  const searchAdmitted = async (studentMatric) => {
    isLoading.value = true;
    error.value = false;
    const client = useSupabaseClient();
    try {
      const { data: searchData, error: searchError } = await client
        .from("ADMITTEDSTUDENTS")
        .select("*")
        .eq("matricNo", studentMatric)
        .single();

      if (searchError) {
        if (searchError.code === "PGRST116") {
          return;
        }
        throw searchError;
      }
      searchDataa.value = searchData;
      return searchData;
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  // FETCH STUDENT DETAILS IN STUDENTS DETAILS FOR UPLOADING PURPOSE
  const fetchStudentForUpdate = async (queryVal) => {
    isFetching.value = true;
    error.value = false;
    const client = useSupabaseClient();
    try {
      const { data: searchStuData, error: searchStuError } = await client
        .from("ADMITTEDSTUDENTS")
        .select("*")
        .eq("email", queryVal.email)
        .single();

      if (searchStuError) {
        if (searchStuError.code === "PGRST116") {
          error.value = "No user Found";
          return;
        }
        throw searchStuError;
      }
      updateSearch.value = searchStuData;
    } catch (err) {
      error.value = err.message;
    } finally {
      isFetching.value = false;
    }
  };

  // UPDATE THE FETCHED INFO INCLUDING MATRIC NO, FACULTY, DEPARTMENT
  const updateMatFacDep = async (queryVal) => {
    isUpdating.value = true;
    error.value = null;
    updateInfoDataSuccess.value = false;
    const client = useSupabaseClient();
    try {
      const { data: updateInfoData, error: updateInfoError } = await client
        .from("ADMITTEDSTUDENTS")
        .update({
          matricNo: queryVal.matricNo,
          // faculty: queryVal.faculty,
          // department: queryVal.department
        })
        .eq("email", queryVal.email);

      if (updateInfoError) throw updateInfoError;
      updateInfoDataSuccess.value = true;
      return updateInfoData;
    } catch (err) {
      error.value = err.message;
      return null;
    } finally {
      isUpdating.value = false;
    }
  };

  // INPUT COURSES
  const coursesList = async (courseLists) => {
    isLoading.value = true;
    error.value = false;
    const client = useSupabaseClient();
    try {
      const { data: courseUpData, error: courseUpError } = await client
        .from("COURSELIST")
        .insert([
          {
            code: courseLists.code,
            title: courseLists.title,
            units: courseLists.units,
          },
        ]);
      if (courseUpError) throw courseUpError;
      resultUploadData.value = "Successfully Uploaded";
      // console.log('successful', courseUpData)
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  // FOR PASSPORT

  const administrator = reactive({
    passportPhoto: null,
    passportPhotoUrl: null,
  });

  function setPassportPhoto(file) {
    administrator.passportPhoto = file;
  }
  // UPLOADING THE FILES
  const uploadFiles = async () => {
    isLoading.value = true;
    error.value = null;
    const client = useSupabaseClient();

    try {
      const passportPhotoPath = `admin-profile/${Date.now()}-${
        administrator.passportPhoto.name
      }`;

      const { data: passportData, error: passportError } = await client.storage
        .from("studentform")
        .upload(passportPhotoPath, administrator.passportPhoto);
      if (passportError) throw passportError;

      const passportUrll = client.storage
        .from("studentform")
        .getPublicUrl(passportPhotoPath).data.publicUrl;

      administrator.passportPhotoUrl = passportUrll;

      return passportUrll;
    } catch (err) {
      error.value = err.message;
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // function to upload the picture
  const uploadAdminImage = async () => {
    isLoading.value = true;
    error.value = null;
    const client = useSupabaseClient();
    try {
      const photoUrl = await uploadFiles();
      // console.log("Photo URL:", photoUrl)
      const { data: upData, error: upError } = await client.auth.updateUser({
        data: {
          displayPicture: photoUrl,
        },
      });
      if (upError) throw upError;
      imageUploaded.value = true;
      // console.log(photoUrl)
      // console.log('successful', upData)
    } catch (err) {
      error.value = err.message;
      // console.log(err.message)
    } finally {
      isLoading.value = false;
    }
  };

  const updatePayment = async (paymentData) => {
    isLoading.value = true;
    error.value = null;
    const client = useSupabaseClient();
    try {
      // First fetch the current row to get existing metadata
      const { data: currentData, error: fetchError } = await client
        .from("ADMITTEDSTUDENTS")
        .select("payment_info")
        .eq("email", paymentData.email)
        .single();

      if (fetchError) throw fetchError;

      // Initialize metadata if it doesn't exist
      const metadataUpdate = currentData.payment_info || {};

      // If payments array doesn't exist yet, create it
      if (!metadataUpdate.payments) {
        metadataUpdate.payments = [];
      }

      // Create a new payment entry with timestamp
      const newPaymentEntry = {
        amountPaid: paymentData.amountPaid,
        paymentMade: paymentData.paymentMade,
        receivedBy: paymentData.receiver,
        timestamp: new Date().toISOString(),
      };

      // Add the new payment to the payments array
      metadataUpdate.payments.push(newPaymentEntry);

      // Update the record with the modified metadata
      const { data: payData, error: payError } = await client
        .from("ADMITTEDSTUDENTS")
        .update({
          payment_info: metadataUpdate,
        })
        .eq("email", paymentData.email);

      if (payError) throw payError;
      updateInfoDataSuccess.value = true;
      return payData;
    } catch (err) {
      error.value = err.message;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // FETCH PAYMENT
  const checkPayments = async (check) => {
    isLoading.value = true;
    error.value = null;
    const client = useSupabaseClient();
    try {
      const { data: paymentData, error: paymentError } = await client
        .from("ADMITTEDSTUDENTS")
        .select("*")
        // .select('payment_info', 'lastname', 'firstname', 'middlename', 'matricNo')
        .eq("email", check)
        .single();
      if (paymentError) throw paymentError;
      const paymentHistory = paymentData.payment_info?.payments || [];
      paymentsIn.value = paymentHistory;
      paymentsDataL.value = paymentData;
      return paymentData;
    } catch (err) {
      error.value = err.message;
      // console.log(err.message)
    } finally {
      isLoading.value = false;
    }
  };

  // FETCH ALL ADMITTED STUDENTS
  const fetchAdmittedStudents = async () => {
    isLoading.value = true;
    error.value = null;
    const client = useSupabaseClient();
    try {
      const { data: admittedStudentData, error: admittedStudentError } =
        await client.from("ADMITTEDSTUDENTS").select("*");
      if (admittedStudentError) throw admittedStudentError;
      allAdmitted.value = admittedStudentData;
      // console.log(admittedStudentData)
      return admittedStudentData;
    } catch (err) {
      error.value = err.message;
      // console.log(err.message)
    } finally {
      isLoading.value = false;
    }
  };

  // FETCH ALL COURSES
  const fetchAllCourse = async () => {
    isLoading.value = true;
    error.value = null;
    const client = useSupabaseClient();
    try {
      const { data: formData, error: formError } = await client
        .from("COURSELIST")
        .select("*");

      if (formError) throw formError;
      courseLists.value = formData;
      // console.log(formData)
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };




  // FETCH STUDENTS RESULT

  const replaceMatric = (matric) => {
    return matric.replaceAll("/", "-");
  };

  // FETCH STUDENT SCORES PER SEMESTER
  const fetchStudentScores = async (resultSelect) => {
    isLoading.value = true;
    error.value = null;

    const yearRange = resultSelect.year;
    const semester = resultSelect.semester;
    const selectedLevel = resultSelect.level;
    const matricValue = resultSelect.matricNo;
    const [previousYear, currentYear] = yearRange.split("/");

    try {
      const matricNum = replaceMatric(matricValue);
      let sessionToUse = `${previousYear}-${currentYear}`;

      const { $firebase } = useNuxtApp();
      const db = $firebase.firestore;

      const subcollectionPath = `COURSE_FORM/${matricNum}/${sessionToUse}-${semester}`;
      const courseFormCollection = collection(db, subcollectionPath);

      // Get all documents in the subcollection
      const querySnapshot = await getDocs(courseFormCollection);

      if (querySnapshot.empty) {
        results.value = [];
        noResults.value = true;
        return {
          success: false,
          error: "No course registration found for this student and session",
          message: "No course registration found for this student this session",
          courseFound: false,
          courseData: null,
        };
      }

      // Collect all courses from documents that match the selected level
      let allCourses = [];
      let studentMetadata = null;

      querySnapshot.forEach((doc) => {
        const docData = doc.data();

        // Extract student metadata if available
        if (docData._metadata) {
          studentMetadata = docData._metadata;

          // Check if this document's level matches the selected level
          if (docData._metadata.level !== selectedLevel) {
            // Skip this document if level doesn't match
            return;
          }
        } else {
          // Skip documents without metadata
          return;
        }

        // Extract all courses from this document (excluding metadata)
        // Only execute this if the level matches
        Object.keys(docData).forEach((key) => {
          if (key !== "_metadata") {
            const courseData = docData[key];

            // Check if this looks like course data (has expected properties)
            if (courseData && typeof courseData === "object") {
              allCourses.push({
                courseCode: key,
                ...courseData,
                documentId: doc.id,
                level: docData._metadata.level, // Add level info to course data
              });
            }
          }
        });
      });

      if (allCourses.length === 0) {
        results.value = [];
        noResults.value = true;
        return {
          success: false,
          courseFound: false,
          courseData: null,
          message: `No courses found for level ${selectedLevel} in Student's Course Form`,
        };
      }

      // Calculate results for all courses (similar to old code logic)
      results.value = allCourses.map((courseScore) => {
        const totalScore = calculateTotalScore(
          courseScore.attendance,
          courseScore.exam,
          courseScore.practical,
          courseScore.test
        );
        const { grade, gradePoint } = calculateGrade(totalScore);
        grades.value = grade
        gPoint.value = gradePoint
        return {
          ...courseScore,
          totalScore,
          grade,
          gradePoint,
          // Add session info for consistency
          studentMetadata,
          semester: semester,
          year: yearRange,
          matricNo: matricValue,
        };
      });

      // Reset noResults flag since we found courses
      noResults.value = false;

      // console.log('courseData: ', allCourses)
      // console.log('studentInfo: ', studentMetadata)
      // console.log('totalCourses: ', allCourses.length)
      // console.log('selectedLevel: ', selectedLevel)
      // console.log('subcollectionPath: ', subcollectionPath)

      return {
        success: true,
        courseFound: true,
        courseData: allCourses,
        totalCourses: allCourses.length,
        studentInfo: studentMetadata,
        selectedLevel: selectedLevel,
        subcollectionPath: subcollectionPath,
      };
    } catch (err) {
      error.value = err.message;
      console.log(err.message);
      results.value = [];

      return {
        success: false,
        error: err.message,
        courseFound: false,
        courseData: null,
      };
    } finally {
      isLoading.value = false;
    }
  };

  // CALCULATE TOTAL SCORE
  const calculateTotalScore = (assessment, exam, practical, test) => {
    const assessmentScore = Number(assessment || 0);
    const testScore = Number(test || 0);
    const examScore = Number(exam || 0);
    const practicalScore = Number(practical || 0);

    return assessmentScore + testScore + examScore + practicalScore;
  };

  // CALCULATE GRADE POINT BASED ON TOTAL SCORE
  const calculateGrade = (totalScore) => {
    if (totalScore >= 75)
      return {
        grade: "A",
        gradePoint: 4.0,
      };
    if (totalScore >= 70)
      return {
        grade: "AB",
        gradePoint: 3.5,
      };
    if (totalScore >= 65)
      return {
        grade: "B",
        gradePoint: 3.25,
      };
    if (totalScore >= 60)
      return {
        grade: "BC",
        gradePoint: 3.0,
      };
    if (totalScore >= 55)
      return {
        grade: "C",
        gradePoint: 2.75,
      };
    if (totalScore >= 50)
      return {
        grade: "CD",
        gradePoint: 2.5,
      };
    if (totalScore >= 45)
      return {
        grade: "D",
        gradePoint: 2.25,
      };
    if (totalScore >= 40)
      return {
        grade: "E",
        gradePoint: 2.0,
      };
    return {
      grade: "F",
      gradePoint: 0.0,
    };
  };

  // Calculate GPA classification
  const getGPAClassification = (gpa) => {
    const numGPA = parseFloat(gpa);
    if (numGPA >= 3.5) return "Distinction";
    if (numGPA >= 3.0) return "Upper credit";
    if (numGPA >= 2.5) return "Lower credit";
    if (numGPA >= 2.0) return "Pass";
    return "Fail";
  };
  // Total credit units
  const totalCreditUnits = computed(() => {
    return results.value.reduce((sum, course) => {
      const creditUnit = Number(course.cu || 1);
      return sum + creditUnit;
    }, 0);
  });

  // Total weighted points
  const totalWeightedPoints = computed(() => {
    return results.value.reduce((sum, course) => {
      const creditUnit = Number(course.cu || 1);
      return sum + course.gradePoint * creditUnit;
    }, 0);
  });
  // Calculate cumulative GPA
  const cumulativeGPA = computed(() => {
    if (results.value.length === 0) return "0.00";
    return (totalWeightedPoints.value / totalCreditUnits.value).toFixed(2);
  });

  // Get GPA classification
  const gpaClassification = computed(() => {
    return getGPAClassification(cumulativeGPA.value);
  });

  //   TRANSCRIPT SECTION

  // Student Transcript Generator
  // This code generates printable transcripts for students across all semesters

  const generateStudentTranscript = async (matricNo) => {
    isLoading.value = true;
    error.value = null;
    console.log('Starting transcript generation for:', matricNo);
    transcriptData.value = [];

    try {
      const { $firebase } = useNuxtApp();
      const db = $firebase.firestore;
      const matricNum = replaceMatric(matricNo);
      console.log('Processed matric number:', matricNum);

      // Get student details first
      const studentDetails = await getStudentDetails(matricNo);
      if (!studentDetails.success) {
        throw new Error(studentDetails.message || "Student not found");
      }
      console.log('Student details found:', studentDetails);

      // Get all available sessions and semesters for this student
      const allSemesterResults = await getAllSemesterResults(db, matricNum);
      console.log('All semester results:', allSemesterResults);

      if (allSemesterResults.length === 0) {
        return {
          success: false,
          message: "No academic records found for this student",
          transcriptData: [],
        };
      }

      // Process each semester's data
      const processedTranscript = await processSemesterData(
        allSemesterResults,
        studentDetails.studentInfo // Fixed: use studentInfo instead of data
      );

      // Calculate cumulative CGPA
      const transcriptWithCGPA = calculateCumulativeCGPA(processedTranscript);

      transcriptData.value = transcriptWithCGPA;

      return {
        success: true,
        transcriptData: transcriptWithCGPA,
        studentInfo: studentDetails.studentInfo, // Fixed: use studentInfo
        totalSemesters: transcriptWithCGPA.length,
      };
    } catch (err) {
      error.value = err.message;
      console.error("Transcript generation error:", err);
      return {
        success: false,
        error: err.message,
        transcriptData: [],
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Get all semester results for a student
  const getAllSemesterResults = async (db, matricNum) => {
    const allResults = [];
    console.log('Getting all semester results for:', matricNum);

    // Define possible academic sessions and semesters
    const currentYear = new Date().getFullYear();
    const possibleYears = [];

    // Generate possible year ranges (e.g., 2020-2021, 2021-2022, etc.)
    for (let year = currentYear - 10; year <= currentYear + 1; year++) {
      possibleYears.push(`${year}-${year + 1}`);
    }

    // Fixed: Use consistent semester naming convention
    const semesters = ["First", "Second"];

    // Check each possible session-semester combination
    for (const session of possibleYears) {
      for (const semester of semesters) {
        try {
          // Fixed: Use consistent path format (removed extra hyphen)
          const subcollectionPath = `COURSE_FORM/${matricNum}/${session}-${semester}`;
          console.log('Checking path:', subcollectionPath);
          
          const courseFormCollection = collection(db, subcollectionPath);
          const querySnapshot = await getDocs(courseFormCollection);

          if (!querySnapshot.empty) {
            console.log(`Found data for ${session}-${semester}`);
            const semesterData = await processSemesterDocuments(
              querySnapshot,
              session,
              semester
            );
            if (semesterData.courses.length > 0) {
              allResults.push(semesterData);
            }
          }
        } catch (err) {
          // Continue if this session-semester combination doesn't exist
          console.log(`No data found for ${session}-${semester}:`, err.message);
        }
      }
    }

    console.log('Total semesters found:', allResults.length);

    // Sort results chronologically
    return allResults.sort((a, b) => {
      const sessionA = a.session.split("-")[0];
      const sessionB = b.session.split("-")[0];
      if (sessionA !== sessionB) {
        return parseInt(sessionA) - parseInt(sessionB);
      }
      // If same year, first semester comes before second
      return a.semester === "First" ? -1 : 1;
    });
  };

  // Process documents for a specific semester
  const processSemesterDocuments = async (querySnapshot, session, semester) => {
    let allCourses = [];
    let studentMetadata = null;
    let semesterLevel = null;

    console.log(`Processing documents for ${session}-${semester}`);

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      console.log('Document data:', doc.id, docData);

      if (docData._metadata) {
        studentMetadata = docData._metadata;
        semesterLevel = docData._metadata.level;
      }

      // Extract courses from document
      Object.keys(docData).forEach((key) => {
        if (key !== "_metadata") {
          const courseData = docData[key];

          if (courseData && typeof courseData === "object") {
            const totalScore = calculateTotalScore(
              courseData.attendance || 0,
              courseData.exam || 0,
              courseData.practical || 0,
              courseData.test || 0
            );
            const { grade, gradePoint } = calculateGrade(totalScore);

            allCourses.push({
              courseCode: key,
              ...courseData,
              totalScore,
              grade,
              gradePoint,
              creditUnit: courseData.creditUnit || 0,
            });
          }
        }
      });
    });

    console.log(`Found ${allCourses.length} courses for ${session}-${semester}`);

    return {
      session,
      semester,
      level: semesterLevel,
      courses: allCourses,
      metadata: studentMetadata,
    };
  };

  
  const processSemesterData = async (allSemesterResults, studentInfo) => {
    console.log('Processing semester data for', allSemesterResults.length, 'semesters');
    
    return allSemesterResults.map((semesterData) => {
      const courses = semesterData.courses;

      // Calculate semester GPA
      let totalGradePoints = 0;
      let totalCreditUnits = 0;

      courses.forEach((course) => {
        const creditUnit = course.creditUnit || 0;
        totalGradePoints += course.gradePoint * creditUnit;
        totalCreditUnits += creditUnit;
      });

      const semesterGPA =
        totalCreditUnits > 0
          ? (totalGradePoints / totalCreditUnits).toFixed(2)
          : "0.00";

      return {
        ...semesterData,
        semesterGPA: parseFloat(semesterGPA),
        totalCreditUnits,
        totalGradePoints,
        studentInfo,
      };
    });
  };











  // Calculate cumulative CGPA across all semesters
  const calculateCumulativeCGPA = (processedTranscript) => {
    let cumulativeGradePoints = 0;
    let cumulativeCreditUnits = 0;

    return processedTranscript.map((semester, index) => {
      cumulativeGradePoints += semester.totalGradePoints;
      cumulativeCreditUnits += semester.totalCreditUnits;

      const cumulativeCGPA =
        cumulativeCreditUnits > 0
          ? (cumulativeGradePoints / cumulativeCreditUnits).toFixed(2)
          : "0.00";

      return {
        ...semester,
        cumulativeCGPA: parseFloat(cumulativeCGPA),
        cumulativeCreditUnits,
        semesterNumber: index + 1,
      };
    });
  };

  // GET STUDENT METADATA - Fixed version
  const getStudentDetails = async (matricNo) => {
    isLoading.value = true;
    error.value = null;
    console.log('Getting student details for:', matricNo);
    
    try {
      const matricNum = replaceMatric(matricNo);
      console.log('Processed matric number:', matricNum);
      const { $firebase } = useNuxtApp();
      const db = $firebase.firestore;

      const currentYear = new Date().getFullYear();
      const possibleSessions = [];

      // Generate possible sessions - Fixed format consistency
      for (let year = currentYear - 10; year <= currentYear + 1; year++) {
        const nextYear = year + 1;
        const sessionBase = `${year}-${nextYear}`;
        // Try both naming conventions
        possibleSessions.push(`${sessionBase}-First`);
        possibleSessions.push(`${sessionBase}-Second`);
        possibleSessions.push(`${sessionBase}-First`);
        possibleSessions.push(`${sessionBase}-Second`);
      }

      let studentMetadata = null;
      let foundSessions = [];
      
      for (const sessionId of possibleSessions) {
        try {
          const subcollectionPath = `COURSE_FORM/${matricNum}/${sessionId}`;
          console.log('Checking student details path:', subcollectionPath);
          
          const sessionCollection = collection(db, subcollectionPath);
          const sessionSnapshot = await getDocs(sessionCollection);

          if (!sessionSnapshot.empty) {
            foundSessions.push(sessionId);
            console.log('Found session:', sessionId);

            sessionSnapshot.forEach((doc) => {
              const docData = doc.data();
              console.log('Document data for student details:', docData);

              // Extract student metadata if available
              if (docData._metadata && !studentMetadata) {
                studentMetadata = docData._metadata;
                console.log('Found student metadata:', studentMetadata);
              }
            });

            // Break after finding first valid session with metadata
            if (studentMetadata) {
              break;
            }
          }
        } catch (sessionError) {
          console.log(`Error checking session ${sessionId}:`, sessionError.message);
          continue;
        }
      }

      if (!studentMetadata) {
        console.log('No student metadata found in any session');
        return {
          success: false,
          message: 'No student record found for this matric number'
        };
      }

      console.log('Successfully found student metadata:', studentMetadata);
      return {
        success: true,
        studentInfo: studentMetadata,
        foundSessions: foundSessions
      };
    } catch (err) {
      error.value = err.message;
      console.error('Error in getStudentDetails:', err);
      return {
        success: false,
        message: `Error retrieving student details: ${err.message}`
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Print transcript function - Fixed version
  const printStudentTranscript = async (matricNo) => {
    try {
      const transcriptResult = await generateStudentTranscript(matricNo);

      if (!transcriptResult.success) {
        alert(transcriptResult.message || transcriptResult.error || "Failed to generate transcript");
        return;
      }

      // Generate HTML for printing
      const printHTML = generateTranscriptHTML(
        transcriptResult.transcriptData,
        transcriptResult.studentInfo
      );

      // Create new window for printing
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Pop-up blocked. Please allow pop-ups for this site to print the transcript.");
        return;
      }
      
      printWindow.document.write(printHTML);
      printWindow.document.close();

      // Print after content loads
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500); // Small delay to ensure content is fully loaded
      };
    } catch (error) {
      console.error('Error in printStudentTranscript:', error);
      alert('Error generating transcript: ' + error.message);
    }
  };

  // Generate HTML for transcript printing (same as original, just cleaned up)
  const generateTranscriptHTML = (transcriptData, studentInfo) => {
    const logoUrl = 'https://xewyaphdngszwyzsloyh.supabase.co/storage/v1/object/public/studentform/admin-profile/1742743271438-angelLogo.png'
    const transcriptPages = transcriptData
      .map(
        (semester, index) => `
        <div class="transcript-page" ${
          index < transcriptData.length - 1
            ? 'style="page-break-after: always;"'
            : ""
        }>
            <!-- Header -->
            <div class="transcript-header">
                ${logoUrl ? `
                <div class="logo-section">
                    <img src="${logoUrl}" alt="University Logo" class="university-logo" />
                </div>
                ` : ''}
                <div class="school-info">
                    <h1>UNIVERSITY NAME</h1>
                    <h2>STUDENT ACADEMIC TRANSCRIPT</h2>
                    <p>SEMESTER ${semester.semesterNumber} - ${
          semester.session
        } (${semester.semester} SEMESTER)</p>
                </div>
            </div>
            
            <!-- Student Information -->
            <div class="student-info">
                <table class="info-table">
                    <tr>
                        <td><strong>Name:</strong> ${
                          studentInfo.studentName || "N/A"
                        }</td>
                        <td><strong>Matric No:</strong> ${
                          studentInfo.matricNumber || "N/A"
                        }</td>
                    </tr>
                    <tr>
                        <td><strong>Level:</strong> ${
                          semester.level || "N/A"
                        }</td>
                        <td><strong>Department:</strong> ${
                          studentInfo.department || "N/A"
                        }</td>
                    </tr>
                    <tr>
                        <td><strong>Session:</strong> ${semester.session}</td>
                    </tr>
                </table>
            </div>
            
            <!-- Course Results -->
            <div class="results-section">
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Course Code</th>
                            <th>Course Title</th>
                            <th>Credit Unit</th>
                            <th>Attendance</th>
                            <th>Test</th>
                            <th>Practical</th>
                            <th>Exam</th>
                            <th>Total</th>
                            <th>Grade</th>
                            <th>GP</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${semester.courses
                          .map(
                            (course, courseIndex) => `
                            <tr>
                                <td>${courseIndex + 1}</td>
                                <td>${course.courseCode}</td>
                                <td>${
                                  course.courseTitle || course.courseCode
                                }</td>
                                <td>${course.creditUnit || 0}</td>
                                <td>${course.attendance || 0}</td>
                                <td>${course.test || 0}</td>
                                <td>${course.practical || 0}</td>
                                <td>${course.exam || 0}</td>
                                <td>${course.totalScore}</td>
                                <td>${course.grade}</td>
                                <td>${course.gradePoint}</td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
            
            <!-- Semester Summary -->
            <div class="semester-summary">
                <table class="summary-table">
                    <tr>
                        <td><strong>Total Credit Units:</strong> ${
                          studentInfo.gradePoint || "N/A"
                        }</td>
                        <td><strong>Semester GPA:</strong> ${
                          semester.grade
                        }</td>
                        <td><strong>Cumulative CGPA:</strong> ${
                          semester.cumulativeCGPA
                        }</td>
                    </tr>
                </table>
            </div>
            
            <!-- Footer -->
            <div class="transcript-footer">
                <div class="signatures">
                    <div class="signature-block">
                        <p>_________________________</p>
                        <p>Academic Secretary</p>
                    </div>
                    <div class="signature-block">
                        <p>_________________________</p>
                        <p>Registrar</p>
                    </div>
                </div>
                <div class="print-date">
                    <p>Generated on: ${new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    `
      )
      .join("");

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Student Transcript - ${studentInfo.matricNumber}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Times New Roman', serif;
                    font-size: 12px;
                    line-height: 1.4;
                    color: #000;
                }
                
                .transcript-page {
                    width: 210mm;
                    min-height: 297mm;
                    padding: 20mm;
                    margin: 0 auto;
                    background: white;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                
                .transcript-header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #000;
                    padding-bottom: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                }
                
                .logo-section {
                    flex-shrink: 0;
                }
                
                .university-logo {
                    max-width: 80px;
                    max-height: 80px;
                    width: auto;
                    height: auto;
                    object-fit: contain;
                }
                
                .school-info {
                    flex: 1;
                    text-align: center;
                }
                
                .transcript-header h1 {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .transcript-header h2 {
                    font-size: 16px;
                    margin-bottom: 10px;
                }
                
                .student-info {
                    margin-bottom: 25px;
                }
                
                .info-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .info-table td {
                    padding: 8px;
                    border: 1px solid #000;
                    font-size: 11px;
                }
                
                .results-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                
                .results-table th,
                .results-table td {
                    border: 1px solid #000;
                    padding: 6px;
                    text-align: center;
                    font-size: 10px;
                }
                
                .results-table th {
                    background-color: #f0f0f0;
                    font-weight: bold;
                }
                
                .summary-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                }
                
                .summary-table td {
                    padding: 10px;
                    border: 1px solid #000;
                    text-align: center;
                    font-weight: bold;
                }
                
                .transcript-footer {
                    margin-top: 40px;
                    display: flex;
                    justify-content: space-between;
                    align-items: end;
                }
                
                .signatures {
                    display: flex;
                    gap: 50px;
                }
                
                .signature-block {
                    text-align: center;
                }
                
                .signature-block p:first-child {
                    margin-bottom: 5px;
                }
                
                .print-date {
                    font-size: 10px;
                }
                
                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                    }
                    
                    .transcript-page {
                        box-shadow: none;
                        margin: 0;
                        padding: 15mm;
                    }
                }
                
                /* Logo-only layout (centered above text) */
                .transcript-header.logo-centered {
                    flex-direction: column;
                    gap: 15px;
                }
                
                .transcript-header.logo-centered .logo-section {
                    align-self: center;
                }
                
                .transcript-header.logo-centered .university-logo {
                    max-width: 100px;
                    max-height: 100px;
                }
            </style>
        </head>
        <body>
            ${transcriptPages}
        </body>
        </html>
    `;
  };

















  
  // APPROVE STUDENT'S RESULT
  const approveResult = async(resultSelect) => {
    isLoading.value = true
    error.value = null

    const yearRange = resultSelect.year;
    const semester = resultSelect.semester;
    const selectedLevel = resultSelect.level;
    const matricValue = resultSelect.matricNo;
    const [previousYear, currentYear] = yearRange.split("/");
    try {
      // const studentMetadata = null

      const matricNum = replaceMatric(matricValue);
      let sessionToUse = `${previousYear}-${currentYear}`;

      const { $firebase } = useNuxtApp();
      const db = $firebase.firestore;

      const subcollectionPath = `COURSE_FORM/${matricNum}/${sessionToUse}-${semester}`;
      const courseFormCollection = collection(db, subcollectionPath);

      const querySnapshot = await getDocs(courseFormCollection);

      if (querySnapshot.empty) {
        return {
          success: false,
          error: "No course registration found for this student and session",
          message: "No course registration found for this student this session",
          courseFound: false,
          courseData: null,
        };
      }

      let allCourses = [];
            querySnapshot.forEach((doc) => {
        const docData = doc.data();

        // Extract student metadata if available
        if (docData._metadata) {
          
        } else {
          // Skip documents without metadata
          return;
        }

        // Extract all courses from this document (excluding metadata)
        // Only execute this if the level matches
        Object.keys(docData).forEach((key) => {
          if (key !== "_metadata") {
            const courseData = docData[key];

            // Check if this looks like course data (has expected properties)
            if (courseData && typeof courseData === "object") {
              allCourses.push({
                courseCode: key,
                ...courseData,
                documentId: doc.id,
                level: docData._metadata.level, // Add level info to course data
              });
            }
          }
        });
      });

      if (allCourses.length === 0) {
        results.value = [];
        noResults.value = true;
        return {
          success: false,
          courseFound: false,
          courseData: null,
          message: `No courses found for level ${selectedLevel} in Student's Course Form`,
        };
      }

        results.value = allCourses.map((courseScore) => {
        const totalScore = calculateTotalScore(
          courseScore.attendance,
          courseScore.exam,
          courseScore.practical,
          courseScore.test
        );
        const { grade, gradePoint } = calculateGrade(totalScore);
        return {
          ...courseScore,
          totalScore,
          grade,
          gradePoint
        };
      });

      // console.log(grades.value, gPoint.value)

      const response = await updater(resultSelect)
      console.log(response)
    } catch (err) {
      error.value = err.message
      console.log(err.message)
    }finally{
      isLoading.value = false
    }
  }


const updater = async (resultSelect) => {
  console.log(grades.value, gPoint.value)
  const { matricNo, year, semester, level } = resultSelect;
  const [previousYear, currentYear] = year.split("/");

  try {
    const matricNum = replaceMatric(matricNo);
    let sessionToUse = `${previousYear}-${currentYear}`;

    const { $firebase } = useNuxtApp();
    const db = $firebase.firestore;

    const subcollectionPath = `COURSE_FORM/${matricNum}/${sessionToUse}-${semester}`;
    const courseFormCollection = collection(db, subcollectionPath);
    const querySnapshot = await getDocs(courseFormCollection);

    if (querySnapshot.empty) {
      return {
        success: false,
        error: "No documents found",
        message: "No course registration found for this student and session"
      };
    }

    const updatePromises = [];
    const updatedDocuments = [];

    querySnapshot.forEach((docSnap) => {
      const docData = docSnap.data();
      
      // Check if document has metadata and matches the level
      if (docData._metadata && docData._metadata.level === level) {
        
        // Use dot notation to update ONLY grade and gradePoint without overwriting entire metadata
        const updateObject = {
          "_metadata.grade": grades.value,
          "_metadata.gradePoint": gPoint.value,
          "_metadata.lastUpdated": new Date().toISOString(),
          "_metadata.approvalStatus": "approved"
        };

        const docRef = doc(db, subcollectionPath, docSnap.id);
        updatePromises.push(updateDoc(docRef, updateObject));

        updatedDocuments.push({
          documentId: docSnap.id,
          updatedFields: ["grade", "gradePoint", "lastUpdated", "approvalStatus"]
        });
      }
    });

    if (updatePromises.length === 0) {
      return {
        success: false,
        error: "No matching documents found",
        message: `No documents found for level ${level}`
      };
    }

    // Execute all updates
    await Promise.all(updatePromises);

    return {
      success: true,
      message: `Successfully updated metadata for ${updatePromises.length} document(s)`,
      updatedDocuments: updatedDocuments,
      totalUpdated: updatePromises.length,
      grade: grades.value,
      gradePoint: gPoint.value
    };

  } catch (err) {
    console.error("Error updating metadata:", err.message);
    
    return {
      success: false,
      error: err.message,
      message: "Failed to update metadata"
    };
  }
};



  return {
    isLoading,
    isFetching,
    isUpdating,
    error,
    transactioDetails,
    transSaveSuccess,
    admittedStudentss,
    canOut,
    logOut,
    fetchRegistered,
    formStudents,
    selectUser,
    selectedUser,
    signinUser,
    isBypass,
    loggedAdmin,
    resultUploadData,
    uploadResult,
    searchAdmitted,
    searchDataa,
    updateSearch,
    fetchStudentForUpdate,
    updateMatFacDep,
    updateInfoDataSuccess,
    coursesList,
    setPassportPhoto,
    uploadAdminImage,
    imageUploaded,
    updatePayment,
    checkPayments,
    paymentsIn,
    allAdmitted,
    fetchAdmittedStudents,
    fetchAllCourse,
    courseLists,
    paymentsDataL,
    gpaClassification,
    fetchStudentScores,
    results,
    cumulativeGPA,
    noResults,
    approveResult,

    // FOR TRANSCRIPT
    generateStudentTranscript,
    printStudentTranscript,
    getAllSemesterResults,
    processSemesterData,
    calculateCumulativeCGPA,
    getStudentDetails,
    calculateTotalScore,
    calculateGrade,
    replaceMatric,
  };
});
