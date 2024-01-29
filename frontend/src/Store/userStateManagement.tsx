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
  