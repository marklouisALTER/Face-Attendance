import { create } from 'zustand';

type userTransactionType = {
    id: number;
    transaction_id: string;
    face_image: string;
    eyebrows_perc: number;
    leyes_perc: number;
    reyes_perc: number;
    nose_perc: number;
    mouth_perc: number;
    create_At: Date;
    overall_perc: number;
}

type transactionType = {
    userTransaction: userTransactionType[];
    updateUserTransaction: (newUserTransaction: userTransactionType[]) => void;
}

export const useUserTransaction = create<transactionType>((set)=> ({
    userTransaction: [],
    updateUserTransaction: (newUserTransaction) => set({userTransaction: newUserTransaction})
}))


// Selected user Attendance
type userAttendandeType = {
    attendance_id: number;
    employee_id: number;
    full_name: string;
    date: string;
    time_in: string;
    time_out: string;
}

type attendanceType = {
    userAttendance: userAttendandeType[];
    updateUserAttendance: (newUserAttendance: userAttendandeType[]) => void;
}
export const useUserAttendance = create<attendanceType>((set) => ({
    userAttendance: [],
    updateUserAttendance: (newUserAttendance) => set({userAttendance: newUserAttendance})
}))

type selectedUserInfo = {
    userInfo: {
      employee_id: number;
      first_name: string;
      last_name: string;
      face_image: string;
      eyebrows: string;
      leyes: string;
      reyes: string;
      nose: string;
      mouth: string;
    };
    updateUserInfo: (value: selectedUserInfo['userInfo']) => void;
  };
  
  export const useSelectedUserProfile = create<selectedUserInfo>((set) => ({
    userInfo: {
      employee_id: 0,
      first_name: '',
      last_name: '',
      face_image: '',
      eyebrows: '',
      leyes: '',
      reyes: '',
      nose: '',
      mouth: '',
    },
    updateUserInfo: (value) => set({ userInfo: value }),
  }));

  
  type userPercentageType = {
    data: {
      employee_id: number;
      avg_face_accuracy: number;
      total_user_transaction: number;
    } | null,
    error: string | null;
    isLoading: boolean;
    fetchData: (employee_id: number | undefined) => void;

  }

export const useUserPercentage = create<userPercentageType>((set)=>({
    data: null,
    error: null,
    isLoading: false,
    fetchData: async (employee_id) => {
      set({isLoading: true, error: null});
      try{
        const response = await fetch(`http://localhost:5000/teachers/teacher-percentage/${employee_id}`);	
        const data = await response.json();
        set({ data, isLoading: false})
      }catch(error){
        set({error: 'Error Fetching Data', isLoading: false})
      }
    }
  }))

type userProfileType = {
  error: boolean;
  isLoading: boolean;
  title: string | null;
  comment: string | null;
  userProfile: {
    data: {
      employee_id: number;
      first_name: string;
      last_name: string;
      face_image: string;
      eyebrows: string;
      lefteye: string; // I assumed 'lefteye' property, adjust it based on your actual data
      righteye: string; // I assumed 'righteye' property, adjust it based on your actual data
      nose: string;
      mouth: string;
    }[];
  } | null;
  fetchData: (token: string) => void;
  updateData: () => void;
}

export const useProfileApi = create<userProfileType>((set) => ({
  userProfile: {data: []},
  error: false,
  title: null,
  comment: null,
  isLoading: false,
  fetchData: async (token) => {
    set({isLoading: true});
    try{
      const response = await fetch('http://localhost:5000/teachers/profile',{
        method: 'GET',
        headers: {
          'Authorization': token
        }
      }
      );
      const userProfile = await response.json();
      set({isLoading: false, userProfile})
    }catch(err){
      set({title:'Error', error: true, isLoading: false})
    }
  },
  updateData: () => ({error: false})
}))