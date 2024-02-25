import React from 'react';
import { Switch } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';
import ContrastOutlinedIcon from '@mui/icons-material/ContrastOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SignOut from '@/app/components/SignOutButton';

function page() {
    
    return (
        <div className="max-w-lg mx-auto my-10 w-[90%]">
        <div className="rounded-lg">
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900">Account</h3>
                <div className="mt-6 divide-y divide-gray-200 bg-white">
                    <div className="flex items-center px-5 py-4">
                        <PersonOutlineOutlinedIcon />
                        <span className="text-gray-900 ml-4 ">Adanna Rita</span>
                    </div>
                    <div className="flex items-center px-5 py-4">
                        <EmailOutlinedIcon />
                        <span className="text-gray-900 ml-4 lowercase">Adanna@gmail.com</span>
                    </div>
                    <div className="flex items-center px-5 py-4">
                        <PasswordOutlinedIcon />
                        <span className="text-gray-900 ml-4">Password</span>
                        <div className="ml-auto">
                            <Switch disabled />
                        </div>
                    </div>
                    <div className="flex items-center px-5 py-4">
                        <LogoutOutlinedIcon />
                        <SignOut />
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900">Theme</h3>
                <div className="mt-6 px-5 flex items-center py-4 bg-white">
                    <ContrastOutlinedIcon />
                    <span className="text-gray-900 ml-4">Dark Theme</span>
                    <div className="ml-auto">
                        <Switch disabled />
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900">More</h3>
                <div className="mt-6 px-5 bg-white divide-y divide-gray-200">
                    <div className="flex items-center py-4">
                        <DeleteForeverOutlinedIcon />
                        <span className="text-gray-900 ml-4">Delete Account</span>
                    </div>
                    <div className="flex items-center py-4">
                        <HelpOutlineOutlinedIcon />
                        <a href="mailto:support@linkark.solutions" className="ml-4 text-gray-900">Help and Support</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default page;
